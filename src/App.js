import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import './App.css';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const MenuItem1 = ({text, selectedKey}) => {
  return <div
    className={`menu-item ${selectedKey ? 'active' : ''}`}
    >{text}</div>;
};

const MenuItem2 = ({text, selectedLabel}) => {
  return <div
    className={`menu-item ${selectedLabel ? 'active' : ''}`}
    >{text}</div>;
};

export const Menu1 = (list, selectedKey) =>
  list.map(el => {
    const {prefName, prefCode} = el;
 
    return <MenuItem1 text={prefName} key={prefCode} selected={selectedKey} />;
  });

export const Menu2 = (list, selectedLabel) =>
  list.map(el => {
    const {label} = el;
 
    return <MenuItem2 text={label} key={label} selected={selectedLabel} />;
  });

const Arrow = ({ text, className }) => {
    return (
      <div
        className={className}
      >{text}</div>
    );
  };

const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

//const selected = '北海道';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedName: '北海道',
      selectedKey: 1,
      prefList: [{prefCode: 1, prefName: "北海道"}],
      selectedLabel: '',
      prefPop: [],
      CData: []
    }

    this.menuItems1 = Menu1(this.state.prefList, this.state.selectedKey);
    this.menuItems2 = Menu2(this.state.prefPop, this.state.selectedLabel);
  }

  onSelect = (key, name) => {
    fetch('https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode='+key, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "0TcDvnFjHBuHwOTpnMkYeE4c4KZVTTObEOedJxsg"
      }
    }).then((res) => res.json()).then(jdata => {
      this.setState({
        prefPop: jdata.result.data,
        selectedLabel: jdata.result.data[0].label,
        selectedKey: key,
        selectedName: name,
        CData: this.getPerLabelData(jdata.result.data[0].label, jdata.result.data)
      });
    });
  }

  getPerLabelData = (key, list) => {
    return list.filter((el) => el.label === key).map((elem) => {
      const {data} = elem;
      return data;
    });
  }

  onSelectM2 = (key) => {
    this.setState({
      CData: this.getPerLabelData(key, this.state.prefPop),
      selectedLabel: key
    });
  }

  componentDidMount(){
    fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "0TcDvnFjHBuHwOTpnMkYeE4c4KZVTTObEOedJxsg"
      }
    }).then((res) => res.json()).then(data => {
      this.setState({
        prefList: data.result
      });
    });
  }

  /*

  */

  render() {
    const { selectedKey, selectedLabel } = this.state;
    // Create menu from items
    const menu1 = Menu1(this.state.prefList, selectedKey);
    const menu2 = Menu2(this.state.prefPop, selectedLabel);
    const tempData = this.state.CData;
    return (
      <div className="App">
        <div id='myheader'>Population Composition Trends of Different Prefectures</div>
        <ScrollMenu
          data={menu1}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selectedKey}
          onSelect={this.onSelect}
        />
        <ScrollMenu
          data={menu2}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selectedLabel}
          onSelect={this.onSelectM2}
        />
        
        <div align="center">
        <AreaChart height={400} width={1000} data={tempData[0]}
              margin={{ top: 30, right: 30, left: 30, bottom: 30 }}  >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" label={{value: 'Year', position: 'bottom'}}>
          </XAxis>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
    </AreaChart>
        </div>
      </div>
    );
  }
}

export default App;
