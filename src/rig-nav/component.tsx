import * as React from 'react';
import * as classNames from 'classnames';
import { ExtensionViews, BroadcasterConfig, LiveConfig, Configurations, ProductManagement } from '../constants/nav-items';
import { UserDropdown } from '../user-dropdown';
import { LoginButton } from '../login-button';
import { UserSession } from '../core/models/user-session';
import { ExtensionManifest } from '../core/models/manifest';
import './component.sass';
import { MockApiDropdown } from './mock-api-dropdown';
import * as gear from '../img/gear.svg';

export interface PublicProps {
  openProductManagementHandler: Function,
  openConfigurationsHandler: Function,
  viewerHandler: Function,
  configHandler: Function,
  liveConfigHandler: Function,
  selectedView: string,
  error: string,
}

export interface ReduxStateProps {
  session?: UserSession,
  manifest?: ExtensionManifest,
  mockApiEnabled?: boolean,
}

type Props = PublicProps & ReduxStateProps;

export class RigNavComponent extends React.Component<Props> {
  private openProductManagementHandler = (): void => {
    const { session, manifest, openProductManagementHandler } = this.props;
    if ((session && session.login) && (manifest && manifest.bits_enabled)) {
      openProductManagementHandler();
    }
  }

  public render() {
    const { session, manifest, selectedView } = this.props;
    const extensionViewsClass = classNames({
      'offset': true,
      'top-nav-item': true,
      'top-nav-item__selected': selectedView === ExtensionViews,
    });

    const broadcasterConfigClass = classNames({
      'top-nav-item': true,
      'top-nav-item__selected': selectedView === BroadcasterConfig,
    });

    const liveConfigClass = classNames({
      'top-nav-item': true,
      'top-nav-item__selected': selectedView === LiveConfig,
    });

    const productManagementClass = classNames({
      'top-nav-item': true,
      'top-nav-item__selected': selectedView === ProductManagement,
      'top-nav-item__disabled': !(session && session.login) || !(manifest && manifest.bits_enabled),
    });

    if (this.props.error !== '') {
      return (
        <div className='top-nav-error'>
          <a> {this.props.error} </a>
        </div>
      );
    } else {
      return (
        <div className='top-nav'>
          <div className='personal-bar'>
            <MockApiDropdown />
            <div className='personal-bar__configurations' onClick={(event) => this.props.openConfigurationsHandler()} title='Configurations'>
              <img src={gear} width={24} height={24} alt='Configurations' />
            </div>
            {manifest && <div className='personal-bar__ext-name'>
              <span>{manifest.name}</span>
            </div>}
            <div className='top-nav-item__login'>
              {(session && session.login) ? <UserDropdown session={session} /> : <LoginButton/>}
            </div>
          </div>
          <div className='top-nav__item-container'>
            <a className={extensionViewsClass} onClick={(event) => this.props.viewerHandler()}>
              Extension Views
            </a>
            <a className={broadcasterConfigClass} onClick={(event) => this.props.configHandler()}>
              Broadcaster Config
            </a>
            <a className={liveConfigClass} onClick={(event) => this.props.liveConfigHandler()}>
              Live Config
            </a>
            <a className={productManagementClass} onClick={(event) => this.openProductManagementHandler()}>
              Manage Bits Products
            </a>
          </div>
        </div>
      );
    }
  }
}
