import { relative } from 'node:path/win32';
import React from 'react';
import { Textures } from '../data/textures'

export namespace Preview {
    export class TexturePreview extends React.Component<{
        alternate: Textures.Alternate
    }, {
        expanded: boolean
    }> {
        constructor(props: any) {
            super(props);

            this.state = {expanded: false}
        }

        render(): React.ReactElement {
            var element: React.ReactElement;
            const outerDivStyle: React.CSSProperties = {
                display: "inline",
                width: 0,
                height: 0
            }
            const innerStyle: React.CSSProperties = {
                position: "absolute",
                imageRendering: "pixelated",
                background: "magenta",
                clipPath: "polygon(0px 0px, 16px 0px, 16px 16px, 0px 16px"
            }
            const innerStyle2: React.CSSProperties = {
                position: "absolute",
                imageRendering: "pixelated",
                background: "magenta",
                zIndex: 99
            }

            const aspectRatio = (this.props.alternate.alternateSet?.width.valueOf() ?? 1) / (this.props.alternate.alternateSet?.height.valueOf() ?? 1);

            if (this.state.expanded) {
                element = (
                    <img src={"/nsss-painterly-customizer/pack" + this.props.alternate.getPath()} width={3 * (this.props.alternate.alternateSet?.width.valueOf() ?? 0) + "px"} height={3 * (this.props.alternate.alternateSet?.height.valueOf() ?? 0) + "px"} style={innerStyle2} onMouseLeave={_ => this.setState({expanded: false})} onClick={_ => this.setState({expanded: false})} />
                )
            } else {
                element = (
                    <img src={"/nsss-painterly-customizer/pack" + this.props.alternate.getPath()} style={innerStyle} onMouseEnter={_ => this.setState({expanded: true})} onClick={_ => this.setState({expanded: true})}/>
                )
            }

            return (
                <div style={outerDivStyle}>
                    {element}
                </div>
            );
        }
    }
}