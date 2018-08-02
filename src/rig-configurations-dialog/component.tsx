import * as React from 'react';
import * as closeButton from '../img/close_icon.png';
import './component.sass';

interface RigConfigurationsDialogProps {
  config: object;
  closeConfigurationsHandler: () => void;
  refreshConfigurationsHandler: () => void;
}

export class RigConfigurationsDialog extends React.Component<RigConfigurationsDialogProps> {
  public render() {
    return (
      <div className="rig-configurations-view">
        <div className="rig-configurations-view__background"/>
        <div className="rig-configurations-view__dialog">
          <div className="dialog__top-bar-container">
            <div className="top-bar-container__title"> Dev Rig Configurations </div>
            <div className="top-bar-container__escape" onClick={this.props.closeConfigurationsHandler}><img alt="Close" src={closeButton}/></div>
          </div>
          <hr className="dialog__divider"/>
          <div className="rig-configurations-view__content"> {JSON.stringify(this.props.config, null, 2)} </div>
          <hr className="dialog__divider"/>
          <div className="dialog_bottom-bar">
            <div className="bottom-bar__refresh" onClick={this.props.refreshConfigurationsHandler}> Refresh </div>
            <div className="bottom-bar__cancel" onClick={this.props.closeConfigurationsHandler}> Cancel </div>
          </div>
        </div>
      </div>
    );
  }
}

