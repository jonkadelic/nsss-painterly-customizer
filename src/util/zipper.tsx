import { downloadZip } from 'client-zip'
import { TextureModel } from "../model/texturemodel"
import mergeImages from 'merge-images';
import { Composer } from './composer';


export namespace Zipper {
    export async function createZip(pack: TextureModel.Data.TexturePack) {
        var files: File[] = [];

        for (var texture of pack.textures) {
            if (texture instanceof TextureModel.Data.SingleTexture) {
                let response = await fetch(pack.getFullUrl(texture));
                let blob = await response.blob();

                files.push(new File([blob], texture.file.getPath().substring(1)));
            } else if (texture instanceof TextureModel.Data.TileMapTexture) {
                let blob = await Composer.composeTileImage(texture);

                files.push(new File([blob], texture.file.getPath().substring(1)));
            }
        }

        var zip = await downloadZip(files).blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zip);
        link.download = "painterly-" + pack.generateAlternatesString() + ".zip"
        link.click();
        link.remove();
    }    
}