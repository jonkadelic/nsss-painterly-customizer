import React from 'react'
import { TextureModel } from "../model/texturemodel"
import { TextureView } from "../view/textureview"
import { Composer } from "../util/composer"

export namespace TexturePresenter {
    export class TexturePackPresenter {
        public pack: TextureModel.Data.TexturePack;

        public presenters: (SingleTexturePresenter | TileMapTexturePresenter)[];

        constructor(pack: TextureModel.Data.TexturePack) {
            this.pack = pack;

            this.presenters = [];
            for (var texture of pack.textures) {
                if (texture instanceof TextureModel.Data.SingleTexture) {
                    this.presenters.push(new SingleTexturePresenter(texture));
                } else if (texture instanceof TextureModel.Data.TileMapTexture) {
                    this.presenters.push(new TileMapTexturePresenter(texture));
                }
            }
        }
    }

    interface TexturePresenter {
        texture: TextureModel.Data.SingleTexture | TextureModel.Data.TileMapTexture | TextureModel.Data.SubTexture;
        header: string;
        previewSrc: string;
    }

    interface HasAlternates {
        alternates: TextureAlternatesPresenter;

        setSelectedAlternate(index: number): void;
    }
    
    export class SingleTexturePresenter implements TexturePresenter, HasAlternates {
        public texture: TextureModel.Data.SingleTexture;

        public alternates: TextureAlternatesPresenter;
        public header: string;
        public previewSrc: string;

        constructor(texture: TextureModel.Data.SingleTexture) {
            this.texture = texture;

            this.alternates = new TextureAlternatesPresenter(this, texture.alternates);

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = texture.file.getPath();
            }

            this.previewSrc = texture.pack.getFullUrl(texture.selectedAlternate);
        }

        setSelectedAlternate(index: number): void {
            this.texture.selectedAlternate = this.texture.alternates[index];
        }
    }

    export class TileMapTexturePresenter implements TexturePresenter {
        public texture: TextureModel.Data.TileMapTexture;
        
        public presenters: SubTexturePresenter[];
        public header: string;
        public previewSrc: string = "";

        constructor(texture: TextureModel.Data.TileMapTexture) {
            this.texture = texture;

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = texture.file.getPath();
            }

            this.presenters = texture.subTextures.map(it => new SubTexturePresenter(it));
        }
    }

    export class SubTexturePresenter implements TexturePresenter, HasAlternates {
        public texture: TextureModel.Data.SubTexture;

        public alternates: TextureAlternatesPresenter;
        public header: string;
        public previewSrc: string = "";

        constructor(texture: TextureModel.Data.SubTexture) {
            this.texture = texture;

            this.alternates = new TextureAlternatesPresenter(this, texture.alternates);

            if (texture.metadata.prettyName) {
                this.header = texture.metadata.prettyName;
            } else {
                this.header = "" + (texture.metadata as TextureModel.Metadata.SubTexture).index;
            }

            this.previewSrc = texture.pack.getFullUrl(texture.selectedAlternate);
        }

        setSelectedAlternate(index: number): void {
            this.texture.selectedAlternate = this.texture.alternates[index];
        }
    }

    export class TextureAlternatesPresenter {
        public parent: TexturePresenter & HasAlternates;
        public textures: TextureModel.Data.AlternateTexture[];
        public iconSrcs: string[];
        public get previewSrc(): string {
            return this.parent.previewSrc;
        }

        constructor(parent: TexturePresenter & HasAlternates, textures: TextureModel.Data.AlternateTexture[]) {
            this.parent = parent;
            this.textures = textures;

            this.iconSrcs = textures.map(it => it.pack.getFullUrl(it));
        }

        public async onSelectedTextureChangedAsync(index: number) {
            this.parent.setSelectedAlternate(index);
        }
    }
}