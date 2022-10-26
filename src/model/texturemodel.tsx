export namespace TextureModel {
    export namespace FileStructure {
        export class TexturePackFile {
            public basePath: string;
            public rootDir: Directory;

            constructor(basePath: string, fileSystemMap: object) {
                this.basePath = basePath;

                this.rootDir = new Directory(fileSystemMap, this, "", null);
            }
        }
    
        export abstract class PackItem {
            public pack: TexturePackFile;
            public parent: Directory | null;
            public name: string;
    
            constructor(pack: TexturePackFile, name: string, parent: Directory | null = null) {
                this.pack = pack;
                this.parent = parent;
                this.name = name;
            }
    
            getPath(): string {
                var path: string = this.name;
    
                if (this instanceof Directory) {
                    path += "/";
                }
    
                path = (this.parent?.getPath() ?? "").concat(path);
    
                return path;
            }
        }
    
        export class Directory extends PackItem {
            public children: Array<PackItem> = [];

            constructor(directoryMap: object, pack: TexturePackFile, name: string, parent: Directory | null = null) {
                super(pack, name, parent);

                var directoryMapTyped = directoryMap as {directories?: object[], files?: string[]};

                // Traverse directories
                if (directoryMapTyped.directories) {
                    for (let [key, value] of Object.entries(directoryMapTyped.directories)) {
                        let dir = new Directory(value as object, pack, key, this);
                        this.children.push(dir);
                    }
                }

                // Traverse files
                if (directoryMapTyped.files) {
                    for (let file of directoryMapTyped.files) {
                        let tex = new TextureFile(pack, file, this);
                        this.children.push(tex);
                    }
                }
            }
        }
    
        export class TextureFile extends PackItem {
        }
    }

    export namespace Metadata {
        export abstract class Texture {
            public prettyName?: string = undefined;
            public tilesX?: number = undefined;
            public tilesY?: number = undefined;
            public alternates?: Alternate[];
        }

        export class FileTexture extends Texture {
            public filePath: string;
            public subTextures?: SubTexture[];

            constructor(filePath: string) {
                super();
                this.filePath = filePath;
            }
        }

        export class SubTexture extends Texture {
            public index: number;

            constructor(index: number) {
                super();
                this.index = index;
            }
        }

        export class Alternate {
            public fileName: string;
            public prettyName?: string = undefined;

            constructor(fileName: string) {
                this.fileName = fileName;
            }
        }
    }

    export namespace Data {
        export class TexturePack {
            public file: FileStructure.TexturePackFile;
            public textures: Texture[] = [];
            public metadatas: Metadata.FileTexture[];

            constructor(basePath: string, fileSystemMap: object, metadatas: Metadata.FileTexture[]) {
                this.file = new FileStructure.TexturePackFile(basePath, fileSystemMap);
                this.metadatas = metadatas;
                this.walkDirectory(this.file.rootDir);
            }

            private walkDirectory(dir: FileStructure.Directory) {
                for (var child of dir.children) {
                    if (child instanceof FileStructure.Directory) {
                        this.walkDirectory(child);
                    } else {
                        // Make sure this file has appropriate metadata
                        var filtered = this.metadatas.filter(metadata => metadata.filePath == child.getPath());
                        if (filtered.length > 0) {
                            var metadata = filtered[0];

                            if (metadata.subTextures != undefined) {
                                this.textures.push(new TileMapTexture(this, child, metadata));
                            } else {
                                this.textures.push(new SingleTexture(this, child, metadata));
                            }
                        } else {
                            this.textures.push(new SingleTexture(this, child, new Metadata.FileTexture(child.getPath())))
                        }
                    }
                }
            }

            getFullUrl(item: FileTexture | SubTexture | AlternateTexture): string {
                if (item instanceof FileTexture) {
                    return this.file.basePath + item.file.getPath();
                } else if (item instanceof SubTexture) {
                    return this.getFullUrl(item.parentTexture);
                } else if (item instanceof AlternateTexture) {
                    let altsPath = this.file.basePath + "/alts";
                    var texturePath: String = "";
                    if (item.texture instanceof FileTexture) {
                        texturePath = item.texture.file.getPath();
                    } else if (item.texture instanceof SubTexture) {
                        texturePath = item.texture.parentTexture.file.getPath();
                    }

                    return altsPath + texturePath + "/" + item.name;
                }

                return "";
            }

            private keys = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            generateAlternatesString(): string {
                var builder = "";
                for (const texture of this.textures) {
                    if (texture instanceof SingleTexture) {
                        if (texture.alternates.length > 1) {
                            builder = builder.concat(this.keys[texture.alternates.indexOf(texture.selectedAlternate)])
                        }
                    } else if (texture instanceof TileMapTexture) {
                        for (const subtexture of texture.subTextures) {
                            if (subtexture.alternates.length > 1) {
                                builder = builder.concat(this.keys[subtexture.alternates.indexOf(subtexture.selectedAlternate)])
                            }
                        }
                    }
                }
                return builder;
            }

            loadAlternatesString(alternates: string) {
                var index = 0;
                for (var texture of this.textures) {
                    if (index >= alternates.length) break;
                    if (texture instanceof SingleTexture) {
                        if (texture.alternates.length > 1) {
                            texture.selectedAlternate = texture.alternates[this.keys.indexOf(alternates[index++])];
                            console.log(texture.selectedAlternate.name);
                        } else if (texture instanceof TileMapTexture) {
                            for (var subtexture of texture.subTextures) {
                                if (subtexture.alternates.length > 1) {
                                    subtexture.selectedAlternate = texture.alternates[this.keys.indexOf(alternates[index++])];
                                }
                            }
                        }
                    }
                }
            }
        }

        export abstract class Texture {
            public pack: TexturePack;
            public metadata: Metadata.Texture;

            public width: number = 0;
            public height: number = 0;

            constructor(pack: TexturePack, metadata: Metadata.Texture) {
                this.pack = pack;
                this.metadata = metadata;
            }
        }

        export interface HasAlternates {
            alternates: AlternateTexture[];
            selectedAlternate: AlternateTexture;
        }

        export abstract class FileTexture extends Texture {
            public file: FileStructure.TextureFile;

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.FileTexture) {
                super(pack, metadata);
                this.file = file;
                this.getTextureDimsAsync();
            }

            async getTextureDimsAsync(): Promise<void> {
                var img = new Image();
                img.src = this.pack.getFullUrl(this);
                await img.decode();
                this.width = img.width;
                this.height = img.height;
            }
        }

        export class SingleTexture extends FileTexture implements HasAlternates {
            public alternates: AlternateTexture[] = [];
            public selectedAlternate: AlternateTexture;

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.FileTexture) {
                super(pack, file, metadata);

                this.selectedAlternate = new AlternateTexture(pack, "0-default.png", this, { fileName: "0-default.png", prettyName: "Default"});
                this.alternates.push(this.selectedAlternate);

                if (metadata.alternates) {
                    for (var alternate of metadata.alternates) {
                        this.alternates.push(new AlternateTexture(pack, alternate.fileName, this, alternate));
                    }
                }
            }
        }

        export class TileMapTexture extends FileTexture {
            public subTextures: SubTexture[] = [];

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.FileTexture) {
                super(pack, file, metadata);

                if (metadata.subTextures) {
                    for (var subtexture of metadata.subTextures) {
                        this.subTextures.push(new SubTexture(pack, this, subtexture));
                    }
                }

            }
        }

        export class SubTexture extends Texture implements HasAlternates {
            public alternates: AlternateTexture[] = [];
            public selectedAlternate: AlternateTexture;
            public parentTexture: TileMapTexture;

            constructor(pack: TexturePack, parentTexture: TileMapTexture, metadata: Metadata.SubTexture) {
                super(pack, metadata);
                this.parentTexture = parentTexture;

                this.selectedAlternate = new AlternateTexture(pack, metadata.index + "-default.png", this, { fileName: metadata.index + "-default.png", prettyName: "Default"});
                this.alternates.push(this.selectedAlternate);

                if (metadata.alternates) {
                    for (var alternate of metadata.alternates) {
                        this.alternates.push(new AlternateTexture(pack, alternate.fileName, this, alternate));
                    }
                }

                this.getTextureDims();
            }

            protected getTextureDims() {
                this.width = (this.metadata.tilesX ?? 1) * (this.parentTexture.metadata.tilesX ?? 1);
                this.height = (this.metadata.tilesY ?? 1) * (this.parentTexture.metadata.tilesY ?? 1);
            }
        }

        export class AlternateTexture {
            public pack: TexturePack;
            public name: string;
            public texture: SingleTexture | SubTexture;
            public metadata: Metadata.Alternate;

            public get width(): number {
                return this.texture.width;
            }
            public get height(): number {
                return this.texture.height;
            }

            constructor(pack: TexturePack, name: string, texture: SingleTexture | SubTexture, metadata: Metadata.Alternate) {
                this.pack = pack;
                this.name = name;
                this.texture = texture;
                this.metadata = metadata;
            }
        }
    }
}