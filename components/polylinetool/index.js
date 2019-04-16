// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

type PTProps = {
  __map__: Object,
  events?: Object,
  onInstanceCreated?: Function
}

class PolylineTool extends React.Component<PTProps, {}> {

  map: Object
  tool: Object

  constructor(props: PTProps) {
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

    this.props.onInstanceCreated && this.props.onInstanceCreated()
  }

  render() {
    return (null)
  }
}

export default withPropsReactive(PolylineTool)
