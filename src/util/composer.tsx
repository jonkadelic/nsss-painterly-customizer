import mergeImages from 'merge-images';
import { TextureModel } from "../model/texturemodel"

export namespace Composer {
    export async function composeTileImage(texture: TextureModel.Data.TileMapTexture): Promise<Blob> {
        var tiles: { src: string, x: number, y: number }[] = [];
        const tilesX = texture.metadata.tilesX ?? 1;
        const tilesY = texture.metadata.tilesY ?? 1;
        await texture.getTextureDimsAsync();
        const tileWidth = Math.floor(texture.width / tilesX);
        const tileHeight = Math.floor(texture.height / tilesY);
        const numIndexes = tilesX * tilesY;
        
        for (var i = 0; i < numIndexes; i++) {
            var subTexture = texture.subTextures.find(it => (it.metadata as TextureModel.Metadata.SubTexture).index == i);
            var x = Math.floor(Math.floor(i % tilesX) * tileWidth);
            var y = Math.floor(Math.floor(i / tilesY) * tileHeight);

            if (subTexture) {
                tiles.push({src: texture.pack.getFullUrl(subTexture.selectedAlternate), x: x, y: y});
            }
        }

        var promise = await mergeImages(tiles, {width: texture.width, height: texture.height});

        return await (await fetch(promise)).blob();
    }
}