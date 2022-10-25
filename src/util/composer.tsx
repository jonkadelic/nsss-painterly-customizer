import mergeImages from 'merge-images';
import { TextureModel } from "../model/texturemodel"

export namespace Composer {
    export async function composeTileImage(texture: TextureModel.Data.TileMapTexture): Promise<Blob> {
        var tiles: { src: string, x: number, y: number }[] = [];
        const numIndexes = texture.width * texture.height;
        
        for (var i = 0; i < numIndexes; i++) {
            var subTexture = texture.subTextures.find(it => (it.metadata as TextureModel.Metadata.SubTexture).index == i);
            var x = Math.floor(i % (texture.metadata.tilesX ?? 1) * Math.floor(texture.width / (texture.metadata.tilesX ?? 1)));
            var y = Math.floor(i / (texture.metadata.tilesY ?? 1) * Math.floor(texture.height / (texture.metadata.tilesY ?? 1)));

            if (subTexture) {
                tiles.push({src: texture.pack.getFullUrl(subTexture.selectedAlternate), x: x, y: y});
            } else {
                tiles.push({src: texture.pack.file.basePath + "/tile-default.png", x: x, y: y});
            }
        }

        var promise = await mergeImages(tiles, {width: texture.width, height: texture.height});

        return await (await fetch(promise)).blob();
    }
}