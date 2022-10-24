import React from 'react';
import logo from './logo.svg';
import './App.css';
import "./data/textures.tsx";
import "./components/picker.tsx";
import { AlternatePicker } from './components/picker';
import { Textures } from './data/textures';
import { Section } from './components/section';
import { Zipper } from './util/zipper'
import { TextureModel } from './data/texturemodel'
import fileStructure from './data/fs.json'
import meta from './data/metadata.json'

function App() {
  loadTexturePack().then(a => console.log(a));
  var rbs: JSX.Element[] = []
  for (var texture of Textures.textures) {
    if (texture.shouldDisplay()) {
      rbs.push(
        <AlternatePicker.TextureAlternatePicker key={texture.getId().toString()} texture={texture}/>
      );
    }
  }
  return (
    <div>
      {rbs}
      <button type="button" onClick={_ => Zipper.createZip()}>Download</button>
    </div>
  );
}

export async function loadTexturePack(): Promise<TextureModel.Data.TexturePack> {
  return new TextureModel.Data.TexturePack("/nsss-painterly-customizer/pack", fileStructure, meta.metadata);
}

export default App;
