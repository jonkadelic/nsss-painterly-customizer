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
        export class Texture {
            public filePath: string;
            public prettyName: string = "";
            public tilesX: number = 1;
            public tilesY: number = 1;
            public alternates?: Alternate[];
            public subTextures?: SubTexture[];

            constructor(filePath: string) {
                this.filePath = filePath;
            }
        }

        export class SubTexture {
            public index: number;
            public prettyName: string = "";
            public tilesX: number = 1;
            public tilesY: number = 1;
            public alternates?: Alternate[];

            constructor(index: number) {
                this.index = index;
            }
        }

        export class Alternate {
            public fileName: string;
            public prettyName: string = "";

            constructor(fileName: string) {
                this.fileName = fileName;
            }
        }
    }

    export namespace Data {
        export class TexturePack {
            public file: FileStructure.TexturePackFile;
            public textures: Texture[] = [];
            public metadatas: Metadata.Texture[];

            constructor(basePath: string, fileSystemMap: object, metadatas: Metadata.Texture[]) {
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
                            this.textures.push(new SingleTexture(this, child, new Metadata.Texture(child.getPath())))
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

                    return altsPath + "/" + item.name;
                }

                return "";
            }
        }

        export abstract class Texture {
            public pack: TexturePack;

            public width: number = 0;
            public height: number = 0;

            constructor(pack: TexturePack) {
                this.pack = pack;
            }
        }

        export interface HasAlternates {
            alternates: AlternateTexture[];
        }

        export abstract class FileTexture extends Texture {
            public file: FileStructure.TextureFile;
            public metadata: Metadata.Texture;

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.Texture) {
                super(pack);
                this.file = file;
                this.metadata = metadata;
                this.getTextureDims();
            }

            protected getTextureDims(): void {
                var img = new Image();
                var tex = this;
                img.onload = _ => {
                    tex.width = img.width;
                    tex.height = img.height;
                }
                img.src = this.pack.getFullUrl(this);
            }
        }

        export class SingleTexture extends FileTexture implements HasAlternates {
            public alternates: AlternateTexture[] = [];

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.Texture) {
                super(pack, file, metadata);
            }
        }

        export class TileMapTexture extends FileTexture {
            public subTextures: SubTexture[] = [];

            constructor(pack: TexturePack, file: FileStructure.TextureFile, metadata: Metadata.Texture) {
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
            public parentTexture: TileMapTexture;
            public metadata: Metadata.SubTexture;

            constructor(pack: TexturePack, parentTexture: TileMapTexture, metadata: Metadata.SubTexture) {
                super(pack);
                this.parentTexture = parentTexture;
                this.metadata = metadata;

                if (metadata.alternates) {
                    for (var alternate of metadata.alternates) {
                        this.alternates.push(new AlternateTexture(pack, alternate.fileName, this, alternate));
                    }
                }

                this.getTextureDims();
            }

            protected getTextureDims() {
                this.width = this.metadata.tilesX * this.parentTexture.metadata.tilesX;
                this.height = this.metadata.tilesY * this.parentTexture.metadata.tilesY;
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