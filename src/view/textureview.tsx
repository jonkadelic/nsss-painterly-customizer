import React from 'react';
import { TextureModel } from '../model/texturemodel';
import { Section } from '../components/section'

export namespace TextureView {
    export class TextureIconComponent extends React.Component<{
        texture: TextureModel.Data.AlternateTexture;
    }> {
        render(): React.ReactNode {
            const imageStyle: React.CSSProperties = {
                imageRendering: "pixelated",
                display: "inline-block",
                background: "magenta",
                margin: 5
            };
            return (
                <img src={this.props.texture.pack.getFullUrl(this.props.texture)} width={48} height={48} onClick={_ => handleTextureClick(this.props.texture)} style={imageStyle}/>
            );
        }
    }

    function handleTextureClick(texture: TextureModel.Data.AlternateTexture) {

    }

    export class TextureListComponent extends React.Component<{
        textures: TextureModel.Data.AlternateTexture[]
    }> {
        render(): React.ReactNode {
            return (
                <div>
                    {this.props.textures.map(it => <TextureIconComponent texture={it}/>)}
                </div>
            );
        }
    }

    export class TextureComponent extends React.Component<{
        texture: TextureModel.Data.Texture
    }> {
        render(): React.ReactNode {
            var inner: JSX.Element = <div></div>;

            if (this.props.texture instanceof TextureModel.Data.SingleTexture || this.props.texture instanceof TextureModel.Data.SubTexture) {
                inner = <TextureListComponent textures={this.props.texture.alternates}/>
            } else if (this.props.texture instanceof TextureModel.Data.TileMapTexture) {
                inner = (<div>
                    {this.props.texture.subTextures.map(it => <TextureComponent texture={it}/>)}
                </div>);
            }
            var name = this.props.texture.metadata.prettyName;
            if (name === undefined) {
                if (this.props.texture instanceof TextureModel.Data.FileTexture) {
                    name = this.props.texture.file.getPath();
                } else {
                    name = "eeee";
                }
            }
            var path: JSX.Element | undefined;
            if (this.props.texture.metadata.prettyName != undefined && this.props.texture instanceof TextureModel.Data.FileTexture) {
                path = <p>{this.props.texture.file.getPath()}</p>
            }

            return (
                <Section.CollapsibleSection header={name} headerLevel={1}>
                    <div>
                        {path}
                        <div className="grid grid-cols-2 gap-4" style={{maxWidth: "768px"}}>
                            <div>
                                {inner}
                            </div>
                            <div style={{width:"400px", marginLeft:"auto", marginRight:"0px", display:"block"}}>
                                <img src={this.props.texture.pack.getFullUrl(this.props.texture as TextureModel.Data.SingleTexture)} style={{imageRendering: "pixelated", width:"100%"}}/>
                            </div>
                        </div>
                    </div>
                </Section.CollapsibleSection>
            );
        }
    }
}