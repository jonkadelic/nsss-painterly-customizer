import React from 'react'
import { TextureModel } from "../model/texturemodel"
import { TextureView } from "../view/textureview"
import { Composer } from "../util/composer"
import * as THREE from 'three'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export namespace TexturePresenter {
    export class TexturePackPresenter {
        public pack: TextureModel.Data.TexturePack;

        public presenters: (SingleTexturePresenter | TileMapTexturePresenter)[];

        constructor(pack: TextureModel.Data.TexturePack) {
            this.pack = pack;

            this.presenters = [];
            for (var texture of pack.textures) {
                if (texture instanceof TextureModel.Data.SingleTexture && texture.alternates.length > 1) {
                    this.presenters.push(new SingleTexturePresenter(texture));
                } else if (texture instanceof TextureModel.Data.TileMapTexture && texture.subTextures.length > 1) {
                    this.presenters.push(new TileMapTexturePresenter(texture));
                }
            }
        }
    }

    interface TexturePresenter {
        texture: TextureModel.Data.SingleTexture | TextureModel.Data.TileMapTexture | TextureModel.Data.SubTexture;
        header: string;
    }

    export interface Previewable {
        previewSrc: string;
        model?: THREE.Object3D;
        updatePreviewCallback?: () => void;

        updatePreviewAsync(): Promise<void>;
    }

    interface HasAlternates {
        alternates: TextureAlternatesPresenter;

        setSelectedAlternateAsync(index: number): Promise<void>;
    }
    
    export class SingleTexturePresenter implements TexturePresenter, HasAlternates, Previewable {
        public texture: TextureModel.Data.SingleTexture;

        public alternates: TextureAlternatesPresenter;
        public header: string;
        public previewSrc: string = "";
        public updatePreviewCallback?: () => void;
        public model?: THREE.Object3D;

        constructor(texture: TextureModel.Data.SingleTexture) {
            this.texture = texture;

            this.alternates = new TextureAlternatesPresenter(this, texture.alternates);

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = texture.file.getPath();
            }

            this.updatePreviewAsync();
            this.updateModelAsync().then(() => {
                if (this.updatePreviewCallback) this.updatePreviewCallback();
            });
        }

        async setSelectedAlternateAsync(index: number): Promise<void> {
            this.texture.selectedAlternate = this.texture.alternates[index];
            await this.updatePreviewAsync();
            await this.updateModelAsync();
            if (this.updatePreviewCallback) this.updatePreviewCallback();
        }

        async updatePreviewAsync(): Promise<void> {
            this.previewSrc = this.texture.pack.getFullUrl(this.texture.selectedAlternate);
        }

        async updateModelAsync(): Promise<void> {
            if (!this.texture.metadata.objSrc) return;
            var objSrc = this.texture.pack.file.basePath + "/models/" + this.texture.metadata.objSrc;

            var manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            var tex = new THREE.Texture();
            var imgLoader = new THREE.ImageLoader(manager);
            var img = await imgLoader.loadAsync(this.previewSrc);
            tex.image = img;
            tex.needsUpdate = true;
            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;

            var objLoader = new OBJLoader(manager);
            var object = await objLoader.loadAsync(objSrc);
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshStandardMaterial({map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
                }
            });

            this.model = object;
        }
    }

    export class TileMapTexturePresenter implements TexturePresenter, Previewable {
        public texture: TextureModel.Data.TileMapTexture;
        
        public presenters: SubTexturePresenter[];
        public header: string;
        public previewSrc: string = "";
        public updatePreviewCallback?: () => void;

        constructor(texture: TextureModel.Data.TileMapTexture) {
            this.texture = texture;

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = texture.file.getPath();
            }


            this.presenters = [];
            for (const subTexture of this.texture.subTextures) {
                if (subTexture.alternates.length > 1) {
                    this.presenters.push(new SubTexturePresenter(this, subTexture));
                }
            }

            this.updatePreviewAsync();
        }

        async updatePreviewAsync(): Promise<void> {
            var blob = await Composer.composeTileImage(this.texture);
            var url = URL.createObjectURL(blob);

            this.previewSrc = url;

            if (this.updatePreviewCallback) this.updatePreviewCallback();
        }
    }

    export class SubTexturePresenter implements TexturePresenter, HasAlternates, Previewable {
        public parent: TileMapTexturePresenter;
        public texture: TextureModel.Data.SubTexture;

        public alternates: TextureAlternatesPresenter;
        public header: string;
        public previewSrc: string = "";
        public updatePreviewCallback?: () => void;

        constructor(parent: TileMapTexturePresenter, texture: TextureModel.Data.SubTexture) {
            this.parent = parent;
            this.texture = texture;

            this.alternates = new TextureAlternatesPresenter(this, texture.alternates);

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = "" + (texture.metadata as TextureModel.Metadata.SubTexture).index;
            }

            this.previewSrc = texture.pack.getFullUrl(texture.selectedAlternate);
        }

        async setSelectedAlternateAsync(index: number): Promise<void> {
            this.texture.selectedAlternate = this.texture.alternates[index];
            this.updatePreviewAsync();
            this.parent.updatePreviewAsync();
        }

        async updatePreviewAsync(): Promise<void> {
            this.previewSrc = this.texture.pack.getFullUrl(this.texture.selectedAlternate);
            if (this.updatePreviewCallback) this.updatePreviewCallback();
        }
    }

    export class TextureAlternatesPresenter {
        public parent: TexturePresenter & HasAlternates & Previewable;
        public textures: TextureModel.Data.AlternateTexture[];
        public iconSrcs: string[];
        public get selectedIndex(): number {
            return (this.parent.texture as TextureModel.Data.HasAlternates).alternates.indexOf((this.parent.texture as TextureModel.Data.HasAlternates).selectedAlternate);
        }
        public updateSelectedTextureCallback?: () => void;

        constructor(parent: TexturePresenter & HasAlternates & Previewable, textures: TextureModel.Data.AlternateTexture[]) {
            this.parent = parent;
            this.textures = textures;

            this.iconSrcs = textures.map(it => it.pack.getFullUrl(it));
        }

        public async onSelectedTextureChangedAsync(index: number) {
            this.parent.setSelectedAlternateAsync(index);
            if (this.updateSelectedTextureCallback) this.updateSelectedTextureCallback();
        }
    }
}