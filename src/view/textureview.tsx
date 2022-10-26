import React from 'react';
import { TextureModel } from '../model/texturemodel';
import { Section } from '../components/section'
import { Composer } from '../util/composer'
import { TexturePresenter } from "../presenter/texturepresenter"

export namespace TextureView {
    export class TexturePackView extends React.Component<{
        presenter: TexturePresenter.TexturePackPresenter
    }> {
        render(): React.ReactNode {
            var views: any[] = [];

            for (var presenter of this.props.presenter.presenters) {
                if (presenter instanceof TexturePresenter.SingleTexturePresenter) {
                    views.push(<SingleTextureView presenter={presenter}/>);
                } else if (presenter instanceof TexturePresenter.TileMapTexturePresenter) {
                    views.push(<TileMapTextureView presenter={presenter}/>);
                }
            }

            return (
                <div style={{maxWidth: "1024px"}}>
                    {views}
                </div>
            )
        }
    }

    export class SingleTextureView extends React.Component<{
        presenter: TexturePresenter.SingleTexturePresenter
    }> {
        render(): React.ReactNode {
            return (
                <Section.CollapsibleSection header={this.props.presenter.header} headerLevel={1}>
                    <TextureAlternatesView presenter={this.props.presenter.alternates}/>
                </Section.CollapsibleSection>
            )
        }
    }

    export class TileMapTextureView extends React.Component<{
        presenter: TexturePresenter.TileMapTexturePresenter
    }> {
        render(): React.ReactNode {
            var stvs: JSX.Element[] = [];

            for (var stp of this.props.presenter.presenters) {
                stvs.push(<SubTextureView presenter={stp}/>);
            }

            return(
                <Section.CollapsibleSection header={this.props.presenter.header} headerLevel={1}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {stvs}
                        </div>
                        <TextureRightHandPreviewComponent previewable={this.props.presenter}/>
                    </div>
                </Section.CollapsibleSection>
            )
        }

        componentDidMount(): void {
            this.props.presenter.updatePreviewAsync();
        }
    }

    export class SubTextureView extends React.Component<{
        presenter: TexturePresenter.SubTexturePresenter
    }> {
        render(): React.ReactNode {
            return (
                <Section.CollapsibleSection header={this.props.presenter.header} headerLevel={2}>
                    <TextureAlternatesView presenter={this.props.presenter.alternates}/>
                </Section.CollapsibleSection>
            )
        }
    }

    export class TextureAlternatesView extends React.Component<{
        presenter: TexturePresenter.TextureAlternatesPresenter
    }> {
        render(): React.ReactNode {
            return (
                <div className="grid grid-cols-2 gap-4">
                    <TextureLeftHandPickerComponent presenter={this.props.presenter} iconSrcs={this.props.presenter.iconSrcs}/>
                    <TextureRightHandPreviewComponent previewable={this.props.presenter.parent}/>
                </div>
            )
        }
    }

    class TextureLeftHandPickerComponent extends React.Component<{
        presenter: TexturePresenter.TextureAlternatesPresenter;
        iconSrcs: string[];
    }> {
        render(): React.ReactNode {
            var tics: any[] = [];

            for (var i = 0; i < this.props.iconSrcs.length; i++) {
                tics.push(<TextureIconComponent presenter={this.props.presenter} imgSrc={this.props.iconSrcs[i]} index={i}/>);
            }

            return (
                <div>
                    {tics}
                </div>
            )
        }
    }

    class TextureRightHandPreviewComponent extends React.Component<{
        previewable: TexturePresenter.Previewable;
    }, {
        previewSrc: string
    }> {
        constructor(props: any) {
            super(props);

            this.state = {previewSrc: this.props.previewable.previewSrc};
        }

        componentDidMount() {
            this.props.previewable.updatePreviewCallback = () => { this.setState({previewSrc: this.props.previewable.previewSrc}) };
        }

        render(): React.ReactNode {
            return (
                <div style={{maxWidth:"512px", maxHeight:"512px", marginLeft:"0px", marginRight:"0px", display:"block"}}>
                    <img src={this.state.previewSrc} style={{imageRendering: "pixelated", width:"100%", objectFit:"contain", maxHeight:"512px"}}/>
                </div>
            )
        }
    }

    class TextureIconComponent extends React.Component<{
        presenter: TexturePresenter.TextureAlternatesPresenter;
        index: number;
        imgSrc: string;
    }> {
        render(): React.ReactNode {
            const imageStyle: React.CSSProperties = {
                imageRendering: "pixelated",
                display: "inline-block",
                background: "magenta",
                margin: 5
            };
            return (
                <img src={this.props.imgSrc} width={48} height={48} onClick={_ => this.props.presenter.onSelectedTextureChangedAsync(this.props.index)} style={imageStyle}/>
            );
        }

    }
}