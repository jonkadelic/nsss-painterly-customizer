import { downloadZip } from 'client-zip'
import { TextureModel } from "../model/texturemodel"
import mergeImages from 'merge-images';


export namespace Zipper {
    // export async function createZip(pack: TextureModel.Data.TexturePack) {
    //     var files: File[] = [];

    //     for (var texture of Textures.textures) {
    //         if (texture.alternateSets.length === 1) {
    //             let response = await fetch("/nsss-painterly-customizer/pack" + texture.alternateSets[0].selectedAlternate.getPath().toString());
    //             let blob = await response.blob();

    //             files.push(new File([blob], texture.path.toString()));
    //         } else {
    //             files.push(await generateCompositeImage(texture));
    //         }
    //     }

    //     var zip = await downloadZip(files).blob();
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(zip);
    //     link.download = "painterly-" + Date.now().valueOf() + ".zip"
    //     link.click();
    //     link.remove();
    // }

    // async function generateCompositeImage(texture: Textures.Texture): Promise<File> {
    //     var alts = texture.alternateSets.map(function(it) { return {
    //         src: "/nsss-painterly-customizer/pack" + it.selectedAlternate.getPath(),
    //         x: Math.floor(it.index.valueOf() % texture.tilesX.valueOf()) * texture.tileWidth.valueOf(),
    //         y: Math.floor(it.index.valueOf() / texture.tilesY.valueOf()) * texture.tileHeight.valueOf()
    //     } });

    //     var promise = await mergeImages(alts, {
    //         width: texture.tileWidth.valueOf() * texture.tilesX.valueOf(),
    //         height: texture.tileHeight.valueOf() * texture.tilesY.valueOf()
    //     })
        
    //     return new File([await (await fetch(promise)).blob()], texture.path.toString())
    // }

    
}