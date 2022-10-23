import React from 'react';
import logo from './logo.svg';
import './App.css';
import "./data/textures.tsx";
import "./components/picker.tsx";
import { AlternatePicker } from './components/picker';
import { Textures } from './data/textures';
import { Section } from './components/section';

function App() {
  var rbs: JSX.Element[] = []
  for (var texture of Textures.textures) {
    if (texture.alternateSets.length > 0) {
      rbs.push(
        <AlternatePicker.TextureAlternatePicker key={texture.getId().toString()} texture={texture}/>
      );
    }
  }
  return (
    <div>
      {rbs}
    </div>
  );
}

export default App;
