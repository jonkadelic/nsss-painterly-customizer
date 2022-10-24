import React from 'react';

export namespace Section {
    export class CollapsibleSection extends React.Component<{
        header: String;
        headerLevel: Number;
        children: React.ReactElement;
    }, {
        expanded: boolean
    }> {
        constructor(props: any) {
            super(props);
            this.state = {expanded: this.props.header == ""};
        }

        render(): React.ReactNode {
            const noselect: React.CSSProperties = {
                userSelect: "none"
            }
            var headerElement: React.ReactElement;
            if (this.props.headerLevel == 1) {
                headerElement = <h1 className="text-4xl font-bold" onClick={it => this.setState({expanded: !this.state.expanded})} style={noselect}>{this.state.expanded ? "˄" : "˅"} {this.props.header}</h1>
            } else {
                headerElement = <h2 className="text-2xl font-bold" onClick={it => this.setState({expanded: !this.state.expanded})} style={noselect}>{this.state.expanded ? "˄" : "˅"} {this.props.header}</h2>
            }

            return ( 
                <div>
                    {this.props.header != "" ? headerElement : ""}
                    <div hidden={!this.state.expanded}>
                        {this.props.children}
                    </div>
                </div>
            )
        }
    }
}