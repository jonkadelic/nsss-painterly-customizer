import json
import sys
import os

jsonModel = {"metadata": []}

def imageIndex(a):
    a = str(a)
    aParts = a.split("-")
    return int(aParts[0])

for (dirpath, dirnames, filenames) in os.walk(sys.argv[1]):
    if dirpath.endswith(".png"):
        dirpathparts = dirpath.split("/")
        dirpathparts.reverse()
        images = list(filter(lambda file: file.endswith(".png"), filenames))
        if len(images) == 0: continue
        images.sort(key=imageIndex)
        imageKeys = list(dict.fromkeys(map(imageIndex, images)))
        items = {
            "filePath": dirpath,
            "prettyName": dirpathparts[0]
        }
        if len(imageKeys) > 1:
            # Has subtextures
            subTextures = []
            for key in imageKeys:
                alts = list(filter(lambda image: image.startswith(str(key) + "-") and not image.endswith("-default.png"), images))
                subTexture = {
                    "index": key,
                    "prettyName": str(key)
                }
                if len(alts) > 0:
                    subTexture["alternates"] = list(map(lambda alt: {"fileName": alt, "prettyName": alt}, alts))
                subTextures.append(subTexture)
            items["subTextures"] = subTextures
        else:
            alts = list(map(lambda alt: {"fileName": alt, "prettyName": alt}, images))
            altsNoDefault = list(filter(lambda alt: not alt["fileName"].endswith("-default.png"), alts))
            if len(altsNoDefault) > 0: items["alternates"] = altsNoDefault
        jsonModel["metadata"].append(items)

print(json.dumps(jsonModel, ))



