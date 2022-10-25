import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Zipper } from './util/zipper'
import { TextureModel } from './model/texturemodel'
import fileStructure from './model/fs.json'
import meta from './model/metadata.json'
import { TextureView } from './view/textureview';
import { TexturePresenter } from "./presenter/texturepresenter"

class App extends React.Component<{
}, {
    pack?: TextureModel.Data.TexturePack
}> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {pack: undefined};
    }

    componentDidMount() {
        loadTexturePack().then(pack => {
            this.setState({pack: pack});
        });
    }

    render(): React.ReactNode {
        if (this.state.pack === undefined) {
            return <div>Loading...</div>
        } else {
            var packPresenter = new TexturePresenter.TexturePackPresenter(this.state.pack);

            return (
                <div>
                    <TextureView.TexturePackView presenter={packPresenter}/>
                    <button type="button" /*onClick={_ => Zipper.createZip()}*/>Download</button>
                </div>
            )
        }
    }
}

async function loadTexturePack(): Promise<TextureModel.Data.TexturePack> {
    return new TextureModel.Data.TexturePack("/nsss-painterly-customizer/pack", fileStructure, meta.metadata);
}

export default App;
