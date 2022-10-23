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
            .withAlternateSet(new AlternateSet(26, "Painting"))
                .withAlternate(new Alternate("26-pastelpainting.png", "Pastel"))
            .withAlternateSet(new AlternateSet(27, "Reeds"))
                .withAlternate(new Alternate("27-cornhusk.png", "Corn husk"))
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
            .withAlternateSet(new AlternateSet(57, "Clay"))
                .withAlternate(new Alternate("57-claywad.png", "Blue-grey"))
            .withAlternateSet(new AlternateSet(58, "Paper"))
            .withAlternateSet(new AlternateSet(59, "Book"))
            .withAlternateSet(new AlternateSet(64, "Wooden Tools"))
            .withAlternateSet(new AlternateSet(65, "Stone Tools"))
            .withAlternateSet(new AlternateSet(66, "Iron Tools"))
            .withAlternateSet(new AlternateSet(67, "Diamond Tools"))
            .withAlternateSet(new AlternateSet(68, "Gold Tools"))
                .withAlternate(new Alternate("68-kinglytools.png", "Kingly"))
            .withAlternateSet(new AlternateSet(69, "Fishing Rod"))
            .withAlternateSet(new AlternateSet(71, "Bowl"))
            .withAlternateSet(new AlternateSet(73, "Copper Ingot"))
            .withAlternateSet(new AlternateSet(74, "Buckets"))
                .withAlternate(new Alternate("74-pumpkinpails.png", "Pumpkin pails"))
            .withAlternateSet(new AlternateSet(78, "Dyes"))
            .withAlternateSet(new AlternateSet(85, "Obsidian Tools"))
            .withAlternateSet(new AlternateSet(87, "Pork"))
                .withAlternate(new Alternate("87-facon.png", "Facon"))
            .withAlternateSet(new AlternateSet(89, "Fish"))
            .withAlternateSet(new AlternateSet(103, "Leather"))
            .withAlternateSet(new AlternateSet(104, "Saddle"))
            .withAlternateSet(new AlternateSet(135, "Minecart"))
            .withAlternateSet(new AlternateSet(136, "Boat"))
            .withAlternateSet(new AlternateSet(144, "Sponge Armour"))
            .withAlternateSet(new AlternateSet(206, "Bone"))
            .withAlternateSet(new AlternateSet(240, "Records"))
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
            .withAlternateSet(new AlternateSet(0, "Grass Top"))
                .withAlternate(new Alternate("0-darkgreen.png", "Dark Green"))
                .withAlternate(new Alternate("0-dead.png", "Dead"))
                .withAlternate(new Alternate("0-deaddark.png", "Dead (Dark)"))
                .withAlternate(new Alternate("0-green.png", "Green"))
                .withAlternate(new Alternate("0-olive.png", "Olive"))
                .withAlternate(new Alternate("0-red.png", "Red"))
                .withAlternate(new Alternate("0-yellow.png", "Yellow"))
            .withAlternateSet(new AlternateSet(1, "Stone"))
            .withAlternateSet(new AlternateSet(2, "Dirt"))
            .withAlternateSet(new AlternateSet(3, "Grass Side"))
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
            .withAlternateSet(new AlternateSet(4, "Wooden Planks"))
                .withAlternate(new Alternate("4-lightwood.png", "Light Wood"))
            .withAlternateSet(new AlternateSet(5, "Slab", 32, 16))
                .withAlternate(new Alternate("5-halfbrickbluegreybricks.png", "Bricks (Blue-grey)"))
                .withAlternate(new Alternate("5-halfbrickbooks.png", "Bookshelf"))
                .withAlternate(new Alternate("5-halfbrickcobble.png", "Cobblestone"))
                .withAlternate(new Alternate("5-halfbrickcobblebrick.png", "Cobblestone (Brick)"))
                .withAlternate(new Alternate("5-halfbrickhalfcobble.png", "Cobblestone (Large)"))
                .withAlternate(new Alternate("5-halfbricklightwood.png", "Wooden Planks (Light)"))
                .withAlternate(new Alternate("5-halfbrickmarkerstone.png", "Marker Stone"))
                .withAlternate(new Alternate("5-halfbrickquilt.png", "Quilt"))
                .withAlternate(new Alternate("5-halfbrickredbricks.png", "Bricks (Red)"))
                .withAlternate(new Alternate("5-halfbrickstone.png", "Stone"))
                .withAlternate(new Alternate("5-halfbrickstump.png", "Log"))
                .withAlternate(new Alternate("5-halfbrickwood.png", "Wooden Planks"))
            .withAlternateSet(new AlternateSet(7, "Bricks"))
                .withAlternate(new Alternate("7-claybrick.png", "Clay"))
            .withAlternateSet(new AlternateSet(8, "TNT", 48, 16))
                .withAlternate(new Alternate("8-creeperbomb.png", "Creeper Bomb"))
                .withAlternate(new Alternate("8-creeperbombskull.png", "Creeper Bomb (Skull)"))
            .withAlternateSet(new AlternateSet(11, "Cobweb"))
            .withAlternateSet(new AlternateSet(12, "Red Flower"))
                .withAlternate(new Alternate("12-flowerhydrangea.png", "Hydrangea"))
                .withAlternate(new Alternate("12-flowernasturtium.png", "Nasturtium"))
                .withAlternate(new Alternate("12-flowerrose.png", "Rose"))
                .withAlternate(new Alternate("12-flowershrub.png", "Shrub"))
                .withAlternate(new Alternate("12-flowershrubdark.png", "Shrub (Dark)"))
            .withAlternateSet(new AlternateSet(13, "Yellow Flower"))
                .withAlternate(new Alternate("13-flowerhydrangea.png", "Hydrangea"))
                .withAlternate(new Alternate("13-flowernasturtium.png", "Nasturtium"))
                .withAlternate(new Alternate("13-flowerrose.png", "Rose"))
                .withAlternate(new Alternate("13-flowershrub.png", "Shrub"))
                .withAlternate(new Alternate("13-flowershrubdark.png", "Shrub (Dark)"))
            .withAlternateSet(new AlternateSet(14, "Blue Flower"))
                .withAlternate(new Alternate("14-flowerhydrangea.png", "Hydrangea"))
                .withAlternate(new Alternate("14-flowernasturtium.png", "Nasturtium"))
                .withAlternate(new Alternate("14-flowerrose.png", "Rose"))
                .withAlternate(new Alternate("14-flowershrub.png", "Shrub"))
                .withAlternate(new Alternate("14-flowershrubdark.png", "Shrub (Dark)"))
            .withAlternateSet(new AlternateSet(15, "Sapling"))
                .withAlternate(new Alternate("15-sapautumn.png", "Autumnal"))
                .withAlternate(new Alternate("15-sapdarkgreen.png", "Dark Green"))
                .withAlternate(new Alternate("15-sapdead.png", "Dead"))
                .withAlternate(new Alternate("15-sapgreen.png", "Green"))
                .withAlternate(new Alternate("15-sapolive.png", "Olive"))
                .withAlternate(new Alternate("15-sappine.png", "Pine"))
            .withAlternateSet(new AlternateSet(16, "Cobblestone"))
                .withAlternate(new Alternate("16-cobbbrick.png", "Brick"))
                .withAlternate(new Alternate("16-markerstone.png", "Marker"))
                .withAlternate(new Alternate("16-undercob.png", "Large"))
            .withAlternateSet(new AlternateSet(17, "Bedrock"))
                .withAlternate(new Alternate("17-fossilbedrock.png", "Fossil"))
                .withAlternate(new Alternate("17-lightbedrock.png", "Light"))
                .withAlternate(new Alternate("17-stonebedrock.png", "Stone"))
            .withAlternateSet(new AlternateSet(18, "Sand"))
            .withAlternateSet(new AlternateSet(19, "Gravel"))
            .withAlternateSet(new AlternateSet(20, "Log"))
            .withAlternateSet(new AlternateSet(22, "Iron Block", 16, 48))
                .withAlternate(new Alternate("22-plainiron.png", "Plain"))
            .withAlternateSet(new AlternateSet(23, "Gold Block", 16, 48))
                .withAlternate(new Alternate("23-plaingold.png", "Plain"))
            .withAlternateSet(new AlternateSet(24, "Diamond Block", 16, 48))
                .withAlternate(new Alternate("24-plaindiamond.png", "Plain"))
            .withAlternateSet(new AlternateSet(25, "Chest", 96, 48))
            .withAlternateSet(new AlternateSet(28, "Red Mushroom"))
            .withAlternateSet(new AlternateSet(29, "Brown Mushroom"))
                .withAlternate(new Alternate("29-darkmushroom.png", "Dark"))
            .withAlternateSet(new AlternateSet(32, "Gold Ore"))
            .withAlternateSet(new AlternateSet(33, "Iron Ore"))
            .withAlternateSet(new AlternateSet(34, "Coal Ore"))
            .withAlternateSet(new AlternateSet(35, "Bookshelf"))
            .withAlternateSet(new AlternateSet(36, "Mossy Cobblestone"))
                .withAlternate(new Alternate("36-mossycobble.png", "Default (Normal moss)"))
                .withAlternate(new Alternate("36-cobbbrickmoss.png", "Brick"))
                .withAlternate(new Alternate("36-markerstonemoss.png", "Marker"))
                .withAlternate(new Alternate("36-undercobmoss.png", "Large"))
            .withAlternateSet(new AlternateSet(37, "Obsidian"))
                .withAlternate(new Alternate("37-obsidiandark.png", "Dark"))
                .withAlternate(new Alternate("37-obsidiandef.png", "Defined"))
            .withAlternateSet(new AlternateSet(43, "Workbench", 32, 32))
            .withAlternateSet(new AlternateSet(44, "Furnace", 32, 32))
            .withAlternateSet(new AlternateSet(48, "Sponge"))
            .withAlternateSet(new AlternateSet(49, "Glass"))
                .withAlternate(new Alternate("49-glassbrick.png", "Brick"))
                .withAlternate(new Alternate("49-glassbrickgrey.png", "Brick (Blue-grey)"))
                .withAlternate(new Alternate("49-glassnoborder.png", "No border"))
                .withAlternate(new Alternate("49-glassshale.png", "Shale"))
                .withAlternate(new Alternate("49-glassstone.png", "Stone"))
            .withAlternateSet(new AlternateSet(50, "Diamond Ore"))
            .withAlternateSet(new AlternateSet(51, "Redstone Ore"))
            .withAlternateSet(new AlternateSet(52, "Leaves", 32, 16))
                .withAlternate(new Alternate("52-treedarkgreen.png", "Dark Green"))
                .withAlternate(new Alternate("52-treedead.png", "Dead"))
                .withAlternate(new Alternate("52-treegreen.png", "Green"))
                .withAlternate(new Alternate("52-treeolive.png", "Olive"))
                .withAlternate(new Alternate("52-treeorange.png", "Orange"))
                .withAlternate(new Alternate("52-treepine.png", "Pine"))
                .withAlternate(new Alternate("52-treered.png", "Red"))
                .withAlternate(new Alternate("52-treeyellow.png", "Yellow"))
            .withAlternateSet(new AlternateSet(64, "White Wool"))
                .withAlternate(new Alternate("64-quilt.png", "Quilt"))
                .withAlternate(new Alternate("64-turtleshell.png", "Turtleshell"))
                .withAlternate(new Alternate("64-tweed.png", "Tweed"))
            .withAlternateSet(new AlternateSet(65, "Mob Spawner"))
                .withAlternate(new Alternate("65-monstercage.png", "Cage"))
            .withAlternateSet(new AlternateSet(66, "Snow"))
            .withAlternateSet(new AlternateSet(67, "Ice"))
            .withAlternateSet(new AlternateSet(68, "Snowy Grass Side"))
                .withAlternate(new Alternate("68-snowlong.png", "Long"))
            .withAlternateSet(new AlternateSet(69, "Cactus", 48, 16))
                .withAlternate(new Alternate("69-cactus.png", "Yellow (no flower)"))
                .withAlternate(new Alternate("69-cactusflower.png", "Yellow (flower)"))
                .withAlternate(new Alternate("69-cactusgreen.png", "Green (no flower)"))
                .withAlternate(new Alternate("69-cactusgreenflower.png", "Green (flower)"))
            .withAlternateSet(new AlternateSet(72, "Clay Block"))
                .withAlternate(new Alternate("72-greyclay.png", "Blue-grey"))
            .withAlternateSet(new AlternateSet(73, "Reeds"))
                .withAlternate(new Alternate("73-cornstalks.png", "Corn Stalks"))
            .withAlternateSet(new AlternateSet(74, "Jukebox"))
            .withAlternateSet(new AlternateSet(76, "Copper Ore"))
            .withAlternateSet(new AlternateSet(77, "Mossy Brick"))
            .withAlternateSet(new AlternateSet(80, "Torch"))
            .withAlternateSet(new AlternateSet(81, "Wooden Door", 16, 32))
                .withAlternate(new Alternate("81-paneldoor.png", "Panel Door"))
                .withAlternate(new Alternate("81-reddoor.png", "Red Door"))
            .withAlternateSet(new AlternateSet(82, "Iron Door", 16, 32))
                .withAlternate(new Alternate("82-prisondoor.png", "Jail Door"))
                .withAlternate(new Alternate("82-vaultdoor.png", "Vault Door"))
            .withAlternateSet(new AlternateSet(83, "Ladder"))
            .withAlternateSet(new AlternateSet(84, "Redstone Dust"))
            .withAlternateSet(new AlternateSet(86, "Farmland"))
            .withAlternateSet(new AlternateSet(88, "Crops", 128, 16))
                .withAlternate(new Alternate("88-pumpkin.png", "Pumpkins"))
                .withAlternate(new Alternate("88-pumpkinspooky.png", "Spooky Pumpkins"))
            .withAlternateSet(new AlternateSet(96, "Lever"))
            .withAlternateSet(new AlternateSet(99, "Redstone Torch", 16, 32))
                .withAlternate(new Alternate("99-redcontrol.png", "Alternate"))
                .withAlternate(new Alternate("99-redlanterns.png", "Red Lantern"))
            .withAlternateSet(new AlternateSet(102, "Redstone Lamp"))
            .withAlternateSet(new AlternateSet(104, "Gold Bricks"))
            .withAlternateSet(new AlternateSet(107, "Leafy Bricks"))
            .withAlternateSet(new AlternateSet(112, "Rails"))
            .withAlternateSet(new AlternateSet(113, "Gears"))
            .withAlternateSet(new AlternateSet(116, "Crying Obsidian"))
            .withAlternateSet(new AlternateSet(144, "Dyed Wool"))
            .withAlternateSet(new AlternateSet(160, "Copper Block"))
            .withAlternateSet(new AlternateSet(205, "Water"))
            .withAlternateSet(new AlternateSet(237, "Lava"))
            .withAlternateSet(new AlternateSet(240, "Block Breaking Animation"))
        ,
        new Texture("water.png", "Water Overlay")
            .withDefaultAlternateSet()
        ,
    ];
}