export namespace Textures {
    export class Alternate {
        public fileName: String;
        public name: String;

        public texture?: Texture = undefined;
        public alternateSet?: AlternateSet = undefined;

        constructor(fileName: String, name: String) {
            this.fileName = fileName;
            this.name = name;
        }

        getPath(): String {
            return this.alternateSet?.getPath().concat(this.fileName.toString()) ?? "";
        }

        getId(): String {
            return this.getPath();
        }
    }

    export class AlternateSet {
        public index: Number;
        public name: String;
        public width: Number;
        public height: Number;
        public alternates: Alternate[];
        public selectedAlternate: Alternate;

        public texture?: Texture = undefined;

        constructor(index: Number, name: String, width: Number = -1, height: Number = -1) {
            this.index = index;
            this.name = name;
            this.width = width;
            this.height = height;
            this.alternates = [];
            this.withAlternate(new Alternate(index + "-default.png", "Default"));
            this.selectedAlternate = this.alternates[0];
        }

        withAlternate(alternate: Alternate): AlternateSet {
            alternate.texture = this.texture;
            alternate.alternateSet = this;
            this.alternates.push(alternate);

            return this;
        }

        getPath(): String {
            return "/alts/" + (this.texture?.path ?? "") + "/";
        }

        getId(): String {
            return this.getPath().concat(this.index.toString());
        }
    }

    export class Texture {
        public path: String;
        public name: String;
        public tilesX: Number;
        public tilesY: Number;
        public tileWidth: Number;
        public tileHeight: Number;
        public alternateSets: AlternateSet[];

        constructor(path: String, name: String, tilesX: Number = 1, tilesY: Number = 1, tileWidth: Number = -1, tileHeight: Number = -1) {
            this.path = path;
            this.name = name;
            this.tilesX = tilesX;
            this.tilesY = tilesY;
            this.alternateSets = [];

            if (tileWidth == -1 || tileHeight == -1) {
                var image = new Image();
                var tex = this;
                image.onload = function() {
                    tex.tileWidth = image.width;
                    tex.tileHeight = image.height;

                    tex.alternateSets.forEach(it => { it.width = tex.tileWidth; it.height = tex.tileHeight; });
                }
                image.src = "/nsss-painterly-customizer/pack/" + this.path;
            }

            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;

            console.log("Added texture " + this.path);
        }

        withAlternateSet(alternateSet: AlternateSet): Texture {
            if (alternateSet == undefined) {
                alternateSet = new AlternateSet(0, "", this.tilesX.valueOf() * this.tileWidth.valueOf(), this.tilesY.valueOf() * this.tileHeight.valueOf());
            }

            alternateSet.texture = this;
            if (alternateSet.width == -1 || alternateSet.height == -1) {
                alternateSet.width = this.tileWidth;
                alternateSet.height = this.tileHeight;
            }
            this.alternateSets.push(alternateSet);

            return this;
        }

        withDefaultAlternateSet(): Texture {
            var alternateSet = new AlternateSet(0, "", this.tilesX.valueOf() * this.tileWidth.valueOf(), this.tilesY.valueOf() * this.tileHeight.valueOf());

            return this.withAlternateSet(alternateSet);
        }

        withAlternate(alternate: Alternate): Texture {
            this.alternateSets[this.alternateSets.length - 1].withAlternate(alternate);

            return this;
        }

        getId(): String {
            return this.path;
        }

        shouldDisplay(): boolean {
            for (var as of this.alternateSets) {
                if (as.alternates.length > 1) {
                    return true;
                }
            }


            return false;
        }
    }

    export const textures: Texture[] = [
        new Texture("armor/cloth_1.png", "Leather Armour Top")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
                .withAlternate(new Alternate("0-monocle.png", "Monocle"))
        ,
        new Texture("armor/cloth_2.png", "Leather Armour Bottom")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
        ,
        new Texture("armor/diamond_1.png", "Diamond Armour Top")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
        ,
        new Texture("armor/diamond_2.png", "Diamond Armour Bottom")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
        ,
        new Texture("armor/gold_1.png", "Gold Armour Top")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
                .withAlternate(new Alternate("0-king.png", "Kingly"))
                .withAlternate(new Alternate("0-noshoulders.png", "No shoulders"))
        ,
        new Texture("armor/gold_2.png", "Gold Armour Bottom")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
                .withAlternate(new Alternate("0-king.png", "Kingly"))
                .withAlternate(new Alternate("0-underpants.png", "Underpants"))
        ,
        new Texture("armor/iron_1.png", "Iron Armour Top")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible")),
        new Texture("armor/iron_2.png", "Iron Armour Bottom")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-blank.png", "Invisible"))
        ,
        new Texture("armor/quiver_1.png", "Quiver Armor Top")
            .withDefaultAlternateSet()
        ,
        new Texture("armor/sponge_1.png", "Sponge Armor Top")
            .withDefaultAlternateSet()
        ,
        new Texture("armor/sponge_2.png", "Sponge Armor Bottom")
            .withDefaultAlternateSet()
        ,
        new Texture("art/kz.png", "Paintings")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-abstract.png", "Abstract"))
                .withAlternate(new Alternate("0-surreal.png", "Surreal"))
        ,
        new Texture("char.png", "Character Skin")
            .withDefaultAlternateSet()
        ,
        new Texture("clouds.png", "Clouds")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-clouds.png", "No clouds"))
                .withAlternate(new Alternate("0-lightclouds.png", "Light clouds"))
        ,
        new Texture("dirt.png", "Dirt Background")
            .withDefaultAlternateSet()
        ,
        new Texture("grass.png", "Grass Background")
            .withDefaultAlternateSet()
        ,
        new Texture("gui/container.png", "Chest GUI")
            .withDefaultAlternateSet()
        ,
        new Texture("gui/crafting.png", "Workbench GUI")
            .withDefaultAlternateSet()
        ,
        new Texture("gui/furnace.png", "Furnace GUI")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-noblueprints.png", "No blueprints"))
        ,
        new Texture("gui/gui.png", "GUI Elements")
            .withDefaultAlternateSet()
        ,
        new Texture("gui/icons.png", "HUD Icons")
            .withDefaultAlternateSet()
        ,
        new Texture("gui/inventory.png", "Inventory GUI")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-creeper.png", "Creeper"))
        ,
        new Texture("gui/items.png", "Items", 16, 16, 16, 16)
            .withAlternateSet(new AlternateSet(0, "Leather Armour", 16, 64))
            .withAlternateSet(new AlternateSet(1, "Chainmail Armour", 16, 64))
            .withAlternateSet(new AlternateSet(2, "Iron Armour", 16, 64))
            .withAlternateSet(new AlternateSet(3, "Diamond Armour", 16, 64))
            .withAlternateSet(new AlternateSet(4, "Gold Armour", 16, 64))
                .withAlternate(new Alternate("4-kinglyarmor.png", "Kingly armour"))
            .withAlternateSet(new AlternateSet(5, "Flint and Steel"))
                .withAlternate(new Alternate("5-flintandsteel.png", "Alternate flint"))
            .withAlternateSet(new AlternateSet(6, "Flint"))
                .withAlternate(new Alternate("6-flint.png", "Alternate flint"))
            .withAlternateSet(new AlternateSet(7, "Coal"))
            .withAlternateSet(new AlternateSet(8, "String"))
            .withAlternateSet(new AlternateSet(9, "Seed"))
            .withAlternateSet(new AlternateSet(10, "Apple"))
            .withAlternateSet(new AlternateSet(11, "Golden Apple"))
            .withAlternateSet(new AlternateSet(12, "Egg"))
            .withAlternateSet(new AlternateSet(14, "Snowball"))
            .withAlternateSet(new AlternateSet(15, "Armour Placeholders", 16, 64))
            .withAlternateSet(new AlternateSet(21, "Bow"))
            .withAlternateSet(new AlternateSet(22, "Brick"))
                .withAlternate(new Alternate("22-claybrick.png", "Clay brick"))
            .withAlternateSet(new AlternateSet(23, "Iron Ingot"))
            .withAlternateSet(new AlternateSet(24, "Feather"))
            .withAlternateSet(new AlternateSet(25, "Wheat"))
                .withAlternate(new Alternate("25-candycorn.png", "Candy corn"))
                .withAlternate(new Alternate("25-cornhusk.png", "Corn husk"))
            .withAlternateSet(new AlternateSet(26, "Painting"))
                .withAlternate(new Alternate("26-pastelpainting.png", "Pastel"))
            .withAlternateSet(new AlternateSet(27, "Reeds"))
            .withAlternateSet(new AlternateSet(28, "Filament"))
            .withAlternateSet(new AlternateSet(30, "Slimeball"))
            .withAlternateSet(new AlternateSet(37, "Arrow"))
            .withAlternateSet(new AlternateSet(38, "Quiver"))
            .withAlternateSet(new AlternateSet(39, "Gold Ingot"))
            .withAlternateSet(new AlternateSet(40, "Gunpowder"))
                .withAlternate(new Alternate("40-creeperbomb.png", "Creeper bomb"))
                .withAlternate(new Alternate("40-darkgunpowder.png", "Dark gunpowder"))
                .withAlternate(new Alternate("40-tntstick.png", "TNT stick"))
            .withAlternateSet(new AlternateSet(41, "Bread"))
                .withAlternate(new Alternate("41-pumpkinpie.png", "Pumpkin pie"))
                .withAlternate(new Alternate("41-treatbag.png", "Treat bag"))
            .withAlternateSet(new AlternateSet(42, "Sign"))
            .withAlternateSet(new AlternateSet(43, "Wooden Door"))
                .withAlternate(new Alternate("43-doorpanel.png", "Panel door"))
                .withAlternate(new Alternate("43-doorred.png", "Red door"))
            .withAlternateSet(new AlternateSet(44, "Iron Door"))
                .withAlternate(new Alternate("44-jaildoor.png", "Jail door"))
                .withAlternate(new Alternate("44-vaultdoor.png", "Vault door"))
            .withAlternateSet(new AlternateSet(53, "Wooden Stick"))
            .withAlternateSet(new AlternateSet(54, "Compass"))
                .withAlternate(new Alternate("54-colourblindcompass.png", "Colourblind"))
            .withAlternateSet(new AlternateSet(55, "Diamond"))
                .withAlternate(new Alternate("55-diamondcluster.png", "Diamond cluster"))
                .withAlternate(new Alternate("55-diamondsuper.png", "Chaos Emerald"))
            .withAlternateSet(new AlternateSet(56, "Redstone Dust"))
                .withAlternate(new Alternate("56-redstonegem.png", "Redstone gem"))
        ,
        new Texture("gui/logo.png", "Logo")
            .withDefaultAlternateSet()
        ,
        new Texture("item/boat.png", "Boat")
            .withDefaultAlternateSet()
        ,
        new Texture("item/cart.png", "Cart")
            .withDefaultAlternateSet()
        ,
        new Texture("item/sign.png", "Sign")
            .withDefaultAlternateSet()
        ,
        new Texture("mob/chicken.png", "Chicken")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-duck.png", "Duck"))
                .withAlternate(new Alternate("0-loon.png", "Duck Hunt duck"))
        ,
        new Texture("mob/cow.png", "Cow")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-cow.png", "'Special' cow"))
                .withAlternate(new Alternate("0-cowspooky.png", "Spooky cow"))
        ,
        new Texture("mob/creeper.png", "Creeper")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-creeper.png", "No glowing eyes"))
                .withAlternate(new Alternate("0-creeperspooky.png", "Spooky creeper"))
                .withAlternate(new Alternate("0-creeperclassic.png", "Classic creeper"))
        ,
        new Texture("mob/pig.png", "Pig")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-pig.png", "'Special' pig"))
                .withAlternate(new Alternate("0-pigspooky.png", "Spooky pig"))
        ,
        new Texture("mob/saddle.png", "Pig Saddle")
            .withDefaultAlternateSet()
        ,
        new Texture("mob/sheep.png", "Sheep")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-sheep.png", "'Special' sheep"))
                .withAlternate(new Alternate("0-sheepspooky.png", "Spooky sheep"))
        ,
        new Texture("mob/sheep_fur.png", "Sheep Fur")
            .withDefaultAlternateSet()
        ,
        new Texture("mob/skeleton.png", "Skeleton")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-skeletonspooky.png", "Spooky skeleton"))
        ,
        new Texture("mob/slime.png", "Slime")
            .withDefaultAlternateSet()
            .withAlternate(new Alternate("0-faceslime.png", "Face slime"))
            .withAlternate(new Alternate("0-redslime.png", "Red slime"))
            .withAlternate(new Alternate("0-slime.png", "Pale slime"))
            .withAlternate(new Alternate("0-slimespooky.png", "Spooky slime"))
        ,
        new Texture("mob/spider.png", "Spider")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-spider.png", "Black spider"))
        ,
        new Texture("mob/spider_eyes.png", "Spider Eyes")
            .withDefaultAlternateSet()
        ,
        new Texture("mob/zombie.png", "Zombie")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-zombiespooky.png", "Spooky zombie"))
        ,
        new Texture("particles.png", "Particles")
            .withDefaultAlternateSet()
        ,
        new Texture("rain.png", "Rain")
            .withDefaultAlternateSet()
        ,
        new Texture("rock.png", "Bedrock Background")
            .withDefaultAlternateSet()
        ,
        new Texture("shadow.png", "Entity Shadow")
            .withDefaultAlternateSet()
        ,
        new Texture("terrain/moon.png", "Moon")
            .withDefaultAlternateSet()
                .withAlternate(new Alternate("0-moon.png", "Three-creeper moon"))
                .withAlternate(new Alternate("0-moon2.png", "Crescent moon"))
        ,
        new Texture("terrain/sun.png", "Sun")
            .withDefaultAlternateSet()
        ,
        new Texture("terrain.png", "Terrain", 16, 16, 16, 16)
            .withAlternateSet(new AlternateSet(0, "Grass Top", 16, 16))
                .withAlternate(new Alternate("0-darkgreen.png", "Dark Green"))
                .withAlternate(new Alternate("0-dead.png", "Dead"))
                .withAlternate(new Alternate("0-deaddark.png", "Dead (Dark)"))
                .withAlternate(new Alternate("0-green.png", "Green"))
                .withAlternate(new Alternate("0-olive.png", "Olive"))
                .withAlternate(new Alternate("0-red.png", "Red"))
                .withAlternate(new Alternate("0-yellow.png", "Yellow"))
            .withAlternateSet(new AlternateSet(1, "Stone", 16, 16))
            .withAlternateSet(new AlternateSet(3, "Grass Side", 16, 16))
                .withAlternate(new Alternate("3-ledgedarkgreen.png", "Ledge Dark Green"))
                .withAlternate(new Alternate("3-ledgedead.png", "Ledge Dead"))
                .withAlternate(new Alternate("3-ledgedeaddark.png", "Ledge Dead (Dark)"))
                .withAlternate(new Alternate("3-ledgegreen.png", "Ledge Green"))
                .withAlternate(new Alternate("3-ledgeolive.png", "Ledge Olive"))
                .withAlternate(new Alternate("3-ledgered.png", "Ledge Red"))
                .withAlternate(new Alternate("3-ledgeyellow.png", "Ledge Yellow"))
                .withAlternate(new Alternate("3-longgrass.png", "Long Default"))
                .withAlternate(new Alternate("3-longgrassdarkgreen.png", "Long Dark Green"))
                .withAlternate(new Alternate("3-longgrassdead.png", "Long Dead"))
                .withAlternate(new Alternate("3-longgrassdeaddark.png", "Long Dead (Dark)"))
                .withAlternate(new Alternate("3-longgrassgreen.png", "Long Green"))
                .withAlternate(new Alternate("3-longgrassolive.png", "Long Olive"))
                .withAlternate(new Alternate("3-longgrassred.png", "Long Red"))
                .withAlternate(new Alternate("3-longgrassyellow.png", "Long Yellow"))
            .withAlternateSet(new AlternateSet(4, "Wooden Planks", 16, 16))
                .withAlternate(new Alternate("4-lightwood.png", "Light Wood"))
            .withAlternateSet(new AlternateSet(5, "Slab", 32, 16))
                .withAlternate(new Alternate("5-halfbrickbluegreybricks.png", "Bricks (Blue-grey)"))
                .withAlternate(new Alternate("5-halfbrickbooks.png", "Bookshelf"))
                .withAlternate(new Alternate("5-halfbrickcobble.png", "Cobblestone"))
                .withAlternate(new Alternate("5-halfbrickcobblebrick.png", "Cobblestone (Brick)"))
                .withAlternate(new Alternate("5-halfbrickhalfcobble.png", "Cobblestone (Big)"))
                .withAlternate(new Alternate("5-halfbricklightwood.png", "Wooden Planks (Light)"))
                .withAlternate(new Alternate("5-halfbrickmarkerstone.png", "Marker Stone"))
                .withAlternate(new Alternate("5-halfbrickquilt.png", "Quilt"))
                .withAlternate(new Alternate("5-halfbrickredbricks.png", "Bricks (Red)"))
                .withAlternate(new Alternate("5-halfbrickstone.png", "Stone"))
                .withAlternate(new Alternate("5-halfbrickstump.png", "Log"))
                .withAlternate(new Alternate("5-halfbrickwood.png", "Wooden Planks"))
            .withAlternateSet(new AlternateSet(7, "Bricks", 16, 16))
                .withAlternate(new Alternate("7-claybrick.png", "Clay"))
            .withAlternateSet(new AlternateSet(8, "TNT", 48, 16))
                .withAlternate(new Alternate("8-creeperbomb.png", "Creeper Bomb"))
                .withAlternate(new Alternate("8-creeperbombskull.png", "Creeper Bomb (Skull)"))
        ,
        new Texture("water.png", "Water Overlay")
            .withDefaultAlternateSet()
        ,
    ];
}