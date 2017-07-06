import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import style from './colorpicker.css';

let instanceId = 0;
class ColorPicker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rgbR: '255',
      rgbG: '0',
      rgbB: '0',
      valHex: 'ff0000',
      hsbH: '0',
      hsbS: '100',
      hsbB: '100',
      hueY: 150,
      selectorX: 150,
      selectorY: 0,
      selectorBgColor: 'rgb(255,0,0)',
    }
    this.instanceId = instanceId++;
    this.currentInteract = null;
  }
  componentWillMount() {
    this.proceedWillReceiveProps(this.props, {});
  }
  componentDidMount() {
    const self = this;
    $(document).on('mousemove.ColorPicker' + this.instanceId, (e) => {
      if(self.currentInteract) {
        let x = Math.round(e.pageX-self.currentInteract.pos.left),
            y = Math.round(e.pageY-self.currentInteract.pos.top);
        if(self.currentInteract.currentTarget.className==`${self.props.prefixCls}-selector`) {
          x = Math.max(0, Math.min(150, x));
          y = Math.max(0, Math.min(150, y));
          self.setState({
            hsbB: 100-parseInt(100*y/150),
            hsbS: parseInt(100*x/150),
            selectorX: x,
            selectorY: y,
          }, ()=>{
            self.syncValues('hsb2rgb', ()=>{ self.syncValues('rgb2hex'); });
          });
        }
        if(self.currentInteract.currentTarget.className==`${self.props.prefixCls}-hue`) {
          y = Math.max(0, Math.min(150, y));
          const mp = {
            r:[[1,1,0,0,0,1,1],
               [0,-1,0,0,1,0,0]],
            g:[[0,0,0,1,1,1,0],
               [0,0,1,0,0,-1,0]],
            b:[[0,1,1,1,0,0,0],
               [1,0,0,-1,0,0,0]],
          };
          const ySeg = parseInt(y/25),
                yOff = parseInt(y%25);
          const col = {
            rgbR: mp.r[0][ySeg]*255 + mp.r[1][ySeg]*yOff*255/25,
            rgbG: mp.g[0][ySeg]*255 + mp.g[1][ySeg]*yOff*255/25,
            rgbB: mp.b[0][ySeg]*255 + mp.b[1][ySeg]*yOff*255/25,
            hsbH: 360*(150-y)/150,
          };
          self.setState({
            hsbH: parseInt(col.hsbH),
            hueY: y,
            selectorBgColor: `rgb(${parseInt(col.rgbR)},${parseInt(col.rgbG)},${parseInt(col.rgbB)})`,
          }, ()=>{
            self.syncValues('hsb2rgb', ()=>{ self.syncValues('rgb2hex'); });
          });
        }
      }
    });
    $(document).on('mouseup.ColorPicker' + this.instanceId, (e) => {
      self.currentInteract = null;
    });
  }
  componentWillUnmount() {
    $(document).off('mouseup.ColorPicker' + this.instanceId);
    $(document).off('mousemove.ColorPicker' + this.instanceId);
    this.currentInteract = null;
    this.instanceId = null;
  }
  componentWillReceiveProps(nextProps) {
    this.proceedWillReceiveProps(nextProps, this.props);
  }
  proceedWillReceiveProps(nextProps, prevProps) {
    const valHex = this.ColToHex(nextProps.color),
          valRGB = this.HexToRGB(valHex),
          valHSB = this.RGBToHSB(valRGB);
    this.setState({
      rgbR: valRGB.rgbR,
      rgbG: valRGB.rgbG,
      rgbB: valRGB.rgbB,
      valHex: valHex,
      // hsbH: valHSB.hsbH,
      // hsbS: valHSB.hsbS,
      // hsbB: valHSB.hsbB,
      // hueY: parseInt(150 - 150 * valHSB.hsbH/360),
      // selectorX: parseInt(150 * valHSB.hsbS/100),
      // selectorY: parseInt(150 * (100-valHSB.hsbB)/100),
    });
  }
  handleMouseDownColor(e) {
    const self = this;
    this.currentInteract = {
      cal: $(e.currentTarget).parent(),
      pos: $(e.currentTarget).offset(),
      currentTarget: e.currentTarget,
    };
  }
  handleChangeField(changeType, e) {
    const self = this;
    let val = e.target.value;
    if(changeType === 'rgbR') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(255, val));
      self.setState({rgbR: val}, ()=>{ self.syncValues('rgb2hex'); });
    }
    if(changeType === 'rgbG') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(255, val));
      self.setState({rgbG: val}, ()=>{ self.syncValues('rgb2hex'); });
    }
    if(changeType === 'rgbB') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(255, val));
      self.setState({rgbB: val}, ()=>{ self.syncValues('rgb2hex'); });
    }
    if(changeType === 'valHex') {
      self.setState({valHex: val}, ()=>{
        self.applyHexColor(val);
      });
    }
    if(changeType === 'hsbH') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(360, val));
      self.setState({hsbH: val}, ()=>{ self.syncValues('hsb2rgb'); });
    }
    if(changeType === 'hsbS') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(255, val));
      self.setState({hsbS: val}, ()=>{ self.syncValues('hsb2rgb'); });
    }
    if(changeType === 'hsbB') {
      val = parseInt(isNaN(+val) ? 0 : +val);
      val = Math.max(0, Math.min(255, val));
      self.setState({hsbB: val}, ()=>{ self.syncValues('hsb2rgb'); });
    }
  }
  syncValues(syncType, onSuccess) {
    const self = this;
    if(syncType === 'hsb2rgb') {
      const valRGB = self.HSBToRGB(self.state);
      self.setState(valRGB, ()=>{
        onSuccess && onSuccess();
      });
      const inputEl = $(ReactDOM.findDOMNode(self)).find(`.${self.props.prefixCls}-hex input`)[0];
      inputEl.select();
      inputEl.focus();
    }
    if(syncType === 'rgb2hex') {
      const valHex = ('00'+parseInt(self.state.rgbR).toString(16)).slice(-2)+
                     ('00'+parseInt(self.state.rgbG).toString(16)).slice(-2)+
                     ('00'+parseInt(self.state.rgbB).toString(16)).slice(-2);
      self.setState({valHex: valHex}, ()=>{
        self.applyHexColor(valHex);
      })
    }
    if(syncType === 'hex2rgb') {
      ;
    }
  }
  applyHexColor(valHex) {
    const self = this;
    const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/ig,
          valCol = '#'+valHex;
    if(regex.test(valCol)) {
      self.setState({valHex: valHex});
      if(self.props.onChange)
        self.props.onChange(valCol);
    }
  }
  RGBToHSB(rgb) {
    rgb.rgbR = Math.max(0, Math.min(255, parseInt(isNaN(+rgb.rgbR) ? 0 : +rgb.rgbR)));
    rgb.rgbG = Math.max(0, Math.min(255, parseInt(isNaN(+rgb.rgbG) ? 0 : +rgb.rgbG)));
    rgb.rgbB = Math.max(0, Math.min(255, parseInt(isNaN(+rgb.rgbB) ? 0 : +rgb.rgbB)));
    var hsb = {
      hsbH: 0,
      hsbS: 0,
      hsbB: 0
    };
    var min = Math.min(rgb.rgbR, rgb.rgbG, rgb.rgbB);
    var max = Math.max(rgb.rgbR, rgb.rgbG, rgb.rgbB);
    var delta = max - min;
    hsb.hsbB = max;
    if (max != 0) {
      
    }
    hsb.hsbS = max != 0 ? 255 * delta / max : 0;
    if (hsb.hsbS != 0) {
      if (rgb.rgbR == max) {
        hsb.hsbH = (rgb.rgbG - rgb.rgbB) / delta;
      } else if (rgb.rgbG == max) {
        hsb.hsbH = 2 + (rgb.rgbB - rgb.rgbR) / delta;
      } else {
        hsb.hsbH = 4 + (rgb.rgbR - rgb.rgbG) / delta;
      }
    } else {
      hsb.hsbH = -1;
    }
    hsb.hsbH *= 60;
    if (hsb.hsbH < 0) {
      hsb.hsbH += 360;
    }
    hsb.hsbS *= 100/255;
    hsb.hsbB *= 100/255;
    return {hsbH:Math.round(hsb.hsbH), hsbS:Math.round(hsb.hsbS), hsbB:Math.round(hsb.hsbB)};
  }
  HSBToRGB(hsb) {
    hsb.hsbH = Math.max(0, Math.min(360, parseInt(isNaN(+hsb.hsbH) ? 0 : +hsb.hsbH)));
    hsb.hsbS = Math.max(0, Math.min(100, parseInt(isNaN(+hsb.hsbS) ? 0 : +hsb.hsbS)));
    hsb.hsbB = Math.max(0, Math.min(100, parseInt(isNaN(+hsb.hsbB) ? 0 : +hsb.hsbB)));
    var rgb = {};
    var h = Math.round(hsb.hsbH);
    var s = Math.round(hsb.hsbS*255/100);
    var v = Math.round(hsb.hsbB*255/100);
    if(s == 0) {
      rgb.rgbR = rgb.rgbG = rgb.rgbB = v;
    } else {
      var t1 = v;
      var t2 = (255-s)*v/255;
      var t3 = (t1-t2)*(h%60)/60;
      if(h==360) h = 0;
      if(h<60) {rgb.rgbR=t1; rgb.rgbB=t2; rgb.rgbG=t2+t3}
      else if(h<120) {rgb.rgbG=t1; rgb.rgbB=t2; rgb.rgbR=t1-t3}
      else if(h<180) {rgb.rgbG=t1; rgb.rgbR=t2; rgb.rgbB=t2+t3}
      else if(h<240) {rgb.rgbB=t1; rgb.rgbR=t2; rgb.rgbG=t1-t3}
      else if(h<300) {rgb.rgbB=t1; rgb.rgbG=t2; rgb.rgbR=t2+t3}
      else if(h<360) {rgb.rgbR=t1; rgb.rgbG=t2; rgb.rgbB=t1-t3}
      else {rgb.rgbR=0; rgb.rgbG=0; rgb.rgbB=0}
    }
    return {rgbR:Math.round(rgb.rgbR), rgbG:Math.round(rgb.rgbG), rgbB:Math.round(rgb.rgbB)};
  }
  HexToRGB(hex) {
    const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/ig,
          col = '#'+hex;
    hex = regex.test(col) ? parseInt(hex, 16) : parseInt('ff0000', 16);
    return {rgbR: hex >> 16, rgbG: (hex & 0x00FF00) >> 8, rgbB: (hex & 0x0000FF)};
  }
  ColToHex(col) {
    const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/ig;
    col = regex.test(col) ? col.substring(1) : 'ff0000';
    return '' + col;
  }
  render() {
    const props = this.props,
          state = this.state,
          prefixCls = props.prefixCls;

    return (<div className={`${prefixCls} ${prefixCls}-${this.instanceId} ${props.className || ''}`}>
      <div className={`${prefixCls}-selector`}
           style={{backgroundColor: state.selectorBgColor}}
           onMouseDown={ this.handleMouseDownColor.bind(this) }>
        <div className={`${prefixCls}-selector-overlay`}>
          <div className="picker" style={{left: state.selectorX+'px', top: state.selectorY+'px'}}></div>
        </div>
      </div>
      <div className={`${prefixCls}-hue`}
           onMouseDown={ this.handleMouseDownColor.bind(this) }>
        <div className="picker" style={{top: state.hueY+'px'}}></div>
      </div>
      <div className={`${prefixCls}-newcolor`} style={{backgroundColor: '#'+state.valHex}}>
      </div>
      <div className={`${prefixCls}-field ${prefixCls}-rgb ${prefixCls}-rgbr`}>
        <span>R</span>
        <input type="text" maxLength="3" size="3" value={ state.rgbR } onChange={ this.handleChangeField.bind(this, 'rgbR') } />
      </div>
      <div className={`${prefixCls}-field ${prefixCls}-rgb ${prefixCls}-rgbg`}>
        <span>G</span>
        <input type="text" maxLength="3" size="3" value={ state.rgbG } onChange={ this.handleChangeField.bind(this, 'rgbG') } />
      </div>
      <div className={`${prefixCls}-field ${prefixCls}-rgb ${prefixCls}-rgbb`}>
        <span>B</span>
        <input type="text" maxLength="3" size="3" value={ state.rgbB } onChange={ this.handleChangeField.bind(this, 'rgbB') } />
      </div>
      <div style={{display: 'none'}}>
        <div className={`${prefixCls}-field ${prefixCls}-hsb ${prefixCls}-hsbh`}>
          <span>H</span>
          <input type="text" maxLength="3" size="3" value={ state.hsbH } onChange={ this.handleChangeField.bind(this, 'hsbH') } />
        </div>
        <div className={`${prefixCls}-field ${prefixCls}-hsb ${prefixCls}-hsbs`}>
          <span>S</span>
          <input type="text" maxLength="3" size="3" value={ state.hsbS } onChange={ this.handleChangeField.bind(this, 'hsbS') } />
        </div>
        <div className={`${prefixCls}-field ${prefixCls}-hsb ${prefixCls}-hsbb`}>
          <span>B</span>
          <input type="text" maxLength="3" size="3" value={ state.hsbB } onChange={ this.handleChangeField.bind(this, 'hsbB') } />
        </div>
      </div>
      <div className={`${prefixCls}-field ${prefixCls}-hex`}>
        <span>#</span>
        <input type="text" maxLength="6" size="6" value={ state.valHex } onChange={ this.handleChangeField.bind(this, 'valHex') } />
      </div>
    </div>)
  }
}
ColorPicker.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  onChange: PropTypes.func,
};
ColorPicker.defaultProps = {
  prefixCls: 'ui-colorpicker',
  className: '',
  color: '#ff0000',
  onChange: () => {},
};

export default ColorPicker;
