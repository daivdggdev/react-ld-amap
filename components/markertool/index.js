// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

type MTProps = {
  __map__: Object,
  events?: Object,
  onInstanceCreated?: Function
}

class MarkerTool extends React.Component<MTProps, {}> {

  map: Object
  tool: Object

  constructor(props: MTProps) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        this.map = props.__map__
        this.loadToolInstance();
      }
    }
  }

  get instance() {
    return this.tool
  }

  shouldComponentUpdate() {
    return false
  }

  loadToolInstance() {
    this.tool = new window.IMAP.PolylineTool();
    this.map.addTool(this.tool);

    this.tool = new window.IMAP.MarkerTool();
    // 修复多次创建标记点导致的ｙ轴偏移问题
    this.tool._createToolMarker = (function(a, b) {
      var c = new window.IMAP.Marker(a, {
        editabled: this.editabled,
        icon: this._icon,
        markerColor: 'blue',
        offset: {
          x: 0,
          y: 0
        }
      });
      this._overlayLayer.addOverlay(c, !1);
      if (b) {
        this._followMarker = c
      } else {
        this._overlays[c.getId()] = c;
        this.triggerEvent(window.IMAP.Constants.ADD_OVERLAY, {
          type: window.IMAP.Constants.ADD_OVERLAY,
          target: this,
          overlay: c
        })
      }
    }).bind(this.tool)

    this.map.addTool(this.tool);
    this.props.onInstanceCreated && this.props.onInstanceCreated()
  }

  render() {
    return (null)
  }
}

export default withPropsReactive(MarkerTool)
