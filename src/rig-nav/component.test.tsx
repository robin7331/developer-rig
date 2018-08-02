import { setupShallowTestWithStore, setupShallowTest } from '../tests/enzyme-util/shallow';
import { RigNav, RigNavComponent } from '.';
import { ExtensionViews, BroadcasterConfig, LiveConfig, Configurations, ProductManagement  } from '../constants/nav-items';
import { LoginButton } from '../login-button';
import { UserDropdown } from '../user-dropdown';
import { ManifestForTest } from '../tests/constants/extension';

describe('<RigNavComponent />', () => {
  const defaultGenerator = () => ({
    openConfigurationsHandler: jest.fn(),
    viewerHandler: jest.fn(),
    configHandler: jest.fn(),
    liveConfigHandler: jest.fn(),
    openProductManagementHandler: jest.fn(),
    selectedView: ExtensionViews,
    error: '',
    manifest: ManifestForTest,
    session: { login: 'test', profileImageUrl: 'test.png', authToken: 'test'},
  });
  const setupRenderer = setupShallowTest(RigNavComponent, defaultGenerator);
  const setupShallow = setupShallowTestWithStore(RigNav, defaultGenerator);

  it('renders correctly', () => {
    const { wrapper } = setupRenderer();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders an error', () => {
    const { wrapper } = setupRenderer({
      error: 'test error',
    });

    expect(wrapper.find('.top-nav-error').text().trim()).toBe('test error');
  });

  it('correctly handles clicks on each tab', () => {
    const { wrapper } = setupRenderer();
    wrapper.find('a.top-nav-item').forEach((tab: any) => {
      tab.simulate('click');
    });
    expect(wrapper.instance().props.viewerHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.configHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.liveConfigHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.openProductManagementHandler).toHaveBeenCalled();
  });

  it('correct css classes are set when things are selected', () => {
    const { wrapper } = setupRenderer({
      selectedView: ExtensionViews,
    });
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: BroadcasterConfig,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: LiveConfig,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: ProductManagement,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);
  });

  it('renders login button if no session', () => {
    const { wrapper } = setupRenderer({
      session: undefined,
    });
    expect(wrapper.find(LoginButton));
  });

  it('renders user dropdown if session exists', () => {
    const { wrapper } = setupRenderer({
      session: { login: 'test', profileImageUrl: 'test.png', authToken: 'test'},
    });
    expect(wrapper.find(UserDropdown));
  });

  it('disables product management tab when user is not logged in', () => {
    const { wrapper } = setupRenderer({
      session: undefined,
    });
    expect(wrapper.find('.top-nav-item__disabled')).toHaveLength(1);
  });

  it('disables product management tab when extension is not bits enabled', () => {
    const { wrapper } = setupRenderer({
      manifest: {
        ...ManifestForTest,
        bits_enabled: false,
      },
    });
    expect(wrapper.find('.top-nav-item__disabled')).toHaveLength(1);
  });
});
