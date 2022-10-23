import React from 'react';
import { Textures } from '../data/textures';
import { Section } from './section'
import { Preview } from './preview'

export namespace AlternatePicker {
    export class AlternateRadioButton extends React.Component<{
        alternate: Textures.Alternate;
        def: boolean;
    }> {
        render(): React.ReactNode {
            return (
                <div>
                    <input type="radio" id={this.props.alternate.getId().toString()} name={this.props.alternate.alternateSet?.getId().toString() ?? "".toString()} value={this.props.alternate.getPath().toString()} defaultChecked={this.props.def} onChange={_ => this.handleRadioButtonSelect()}/>
                    <label htmlFor={this.props.alternate.getId().toString()}>{this.props.alternate.name}</label>
                    <Preview.TexturePreview alternate={this.props.alternate} />
                </div>
            )
        }

        handleRadioButtonSelect() {
            if (this.props.alternate.alternateSet != undefined)
            {
                this.props.alternate.alternateSet.selectedAlternate = this.props.alternate;
                console.log("Set " + this.props.alternate.name);
            }
        }
    }
    
    export class AlternateGroup extends React.Component<{
        texture: Textures.Texture;
        alternateSet: Textures.AlternateSet;
    }> {
        render(): React.ReactNode {
            var rbs: JSX.Element[] = [];
            for (var it of this.props.alternateSet.alternates) {
                var def: boolean = it == this.props.alternateSet.alternates[0];
                rbs.push(<AlternateRadioButton key={it.fileName.toString()} alternate={it} def={def}/>)
            }
            return (
                <Section.CollapsibleSection header={this.props.alternateSet.name} headerLevel={2}>
                    <form>
                        {rbs}
                    </form>
                </Section.CollapsibleSection>
            )
        }
    }

    export class TextureAlternatePicker extends React.Component<{
        texture: Textures.Texture;
    }> {
        render(): React.ReactNode {
            var rbs: React.ReactElement[] = [];
            for (var as of this.props.texture.alternateSets) {
                if (as.alternates.length > 1) {
                    rbs.push(<AlternateGroup key={this.props.texture.path + "-" + as.index} texture={this.props.texture} alternateSet={as}/>)
                }
            }
            return (
                <Section.CollapsibleSection header={this.props.texture.name} headerLevel={1}>
                    <div>
                        {rbs}
                    </div>
                </Section.CollapsibleSection>
            )
        }
    }
}