Your task is to create tests for a component built on React 18.x.

index.tsx
```tsx
import * as React from 'react';
import {
  AriaAttributes,
  Component,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefCallback,
  TouchEventHandler,
} from 'react';
import { MenuPlacer } from './components/Menu';
import LiveRegion from './components/LiveRegion';

import { createFilter, FilterOptionOption } from './filters';
import { DummyInput, ScrollManager, RequiredInput } from './internal/index';
import { AriaLiveMessages, AriaSelection } from './accessibility/index';
import { isAppleDevice } from './accessibility/helpers';

import {
  classNames,
  cleanValue,
  isTouchCapable,
  isMobileDevice,
  noop,
  scrollIntoView,
  isDocumentElement,
  notNullish,
  valueTernary,
  multiValueAsValue,
  singleValueAsValue,
} from './utils';

import {
  formatGroupLabel as formatGroupLabelBuiltin,
  getOptionLabel as getOptionLabelBuiltin,
  getOptionValue as getOptionValueBuiltin,
  isOptionDisabled as isOptionDisabledBuiltin,
} from './builtins';

import { defaultComponents, SelectComponentsConfig } from './components/index';

import {
  ClassNamesConfig,
  defaultStyles,
  StylesConfig,
  StylesProps,
} from './styles';
import { defaultTheme, ThemeConfig } from './theme';

import {
  ActionMeta,
  FocusDirection,
  GetOptionLabel,
  GetOptionValue,
  GroupBase,
  InputActionMeta,
  MenuPlacement,
  MenuPosition,
  OnChangeValue,
  Options,
  OptionsOrGroups,
  PropsValue,
  SetValueAction,
} from './types';

export type FormatOptionLabelContext = 'menu' | 'value';
export interface FormatOptionLabelMeta<Option> {
  context: FormatOptionLabelContext;
  inputValue: string;
  selectValue: Options<Option>;
}

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  /** HTML ID of an element containing an error message related to the input**/
  'aria-errormessage'?: AriaAttributes['aria-errormessage'];
  /** Indicate if the value entered in the field is invalid **/
  'aria-invalid'?: AriaAttributes['aria-invalid'];
  /** Aria label (for assistive tech) */
  'aria-label'?: AriaAttributes['aria-label'];
  /** HTML ID of an element that should be used as the label (for assistive tech) */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** Used to set the priority with which screen reader should treat updates to live regions. The possible settings are: off, polite (default) or assertive */
  'aria-live'?: AriaAttributes['aria-live'];
  /** Customise the messages used by the aria-live component */
  ariaLiveMessages?: AriaLiveMessages<Option, IsMulti, Group>;
  /** Focus the control when it is mounted */
  autoFocus?: boolean;
  /** Remove the currently focused option when the user presses backspace when Select isClearable or isMulti */
  backspaceRemovesValue: boolean;
  /** Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices) */
  blurInputOnSelect: boolean;
  /** When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent  */
  captureMenuScroll: boolean;
  /** Sets a className attribute on the outer component */
  className?: string;
  /**
   * If provided, all inner components will be given a prefixed className attribute.
   *
   * This is useful when styling via CSS classes instead of the Styles API approach.
   */
  classNamePrefix?: string | null;
  /**
   * Provide classNames based on state for each inner component
   */
  classNames: ClassNamesConfig<Option, IsMulti, Group>;
  /** Close the select menu when the user selects an option */
  closeMenuOnSelect: boolean;
  /**
   * If `true`, close the select menu when the user scrolls the document/body.
   *
   * If a function, takes a standard javascript `ScrollEvent` you return a boolean:
   *
   * `true` => The menu closes
   *
   * `false` => The menu stays open
   *
   * This is useful when you have a scrollable modal and want to portal the menu out,
   * but want to avoid graphical issues.
   */
  closeMenuOnScroll: boolean | ((event: Event) => boolean);
  /**
   * This complex object includes all the compositional components that are used
   * in `react-select`. If you wish to overwrite a component, pass in an object
   * with the appropriate namespace.
   *
   * If you only wish to restyle a component, we recommend using the `styles` prop
   * instead. For a list of the components that can be passed in, and the shape
   * that will be passed to them, see [the components docs](/components)
   */
  components: SelectComponentsConfig<Option, IsMulti, Group>;
  /** Whether the value of the select, e.g. SingleValue, should be displayed in the control. */
  controlShouldRenderValue: boolean;
  /** Delimiter used to join multiple values into a single HTML Input value */
  delimiter?: string;
  /** Clear all values when the user presses escape AND the menu is closed */
  escapeClearsValue: boolean;
  /** Custom method to filter whether an option should be displayed in the menu */
  filterOption:
    | ((option: FilterOptionOption<Option>, inputValue: string) => boolean)
    | null;
  /**
   * Formats group labels in the menu as React components
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  formatGroupLabel: (group: Group) => ReactNode;
  /** Formats option labels in the menu and control as React components */
  formatOptionLabel?: (
    data: Option,
    formatOptionLabelMeta: FormatOptionLabelMeta<Option>
  ) => ReactNode;
  /**
   * Resolves option data to a string to be displayed as the label by components
   *
   * Note: Failure to resolve to a string type can interfere with filtering and
   * screen reader support.
   */
  getOptionLabel: GetOptionLabel<Option>;
  /** Resolves option data to a string to compare options and specify value attributes */
  getOptionValue: GetOptionValue<Option>;
  /** Hide the selected option from the menu */
  hideSelectedOptions?: boolean;
  /** The id to set on the SelectContainer component. */
  id?: string;
  /** The value of the search input */
  inputValue: string;
  /** The id of the search input */
  inputId?: string;
  /** Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string;
  /** Is the select value clearable */
  isClearable?: boolean;
  /** Is the select disabled */
  isDisabled: boolean;
  /** Is the select in a state of loading (async) */
  isLoading: boolean;
  /**
   * Override the built-in logic to detect whether an option is disabled
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  isOptionDisabled: (option: Option, selectValue: Options<Option>) => boolean;
  /** Override the built-in logic to detect whether an option is selected */
  isOptionSelected?: (option: Option, selectValue: Options<Option>) => boolean;
  /** Support multiple selected options */
  isMulti: IsMulti;
  /** Is the select direction right-to-left */
  isRtl: boolean;
  /** Whether to enable search functionality */
  isSearchable: boolean;
  /** Async: Text to display when loading options */
  loadingMessage: (obj: { inputValue: string }) => ReactNode;
  /** Minimum height of the menu before flipping */
  minMenuHeight: number;
  /** Maximum height of the menu before scrolling */
  maxMenuHeight: number;
  /** Whether the menu is open */
  menuIsOpen: boolean;
  /**
   * Default placement of the menu in relation to the control. 'auto' will flip
   * when there isn't enough space below the control.
   */
  menuPlacement: MenuPlacement;
  /** The CSS position value of the menu, when "fixed" extra layout management is required */
  menuPosition: MenuPosition;
  /**
   * Whether the menu should use a portal, and where it should attach
   *
   * An example can be found in the [Portaling](/advanced#portaling) documentation
   */
  menuPortalTarget?: HTMLElement | null;
  /** Whether to block scroll events when the menu is open */
  menuShouldBlockScroll: boolean;
  /** Whether the menu should be scrolled into view when it opens */
  menuShouldScrollIntoView: boolean;
  /** Name of the HTML Input (optional - without this, no input will be rendered) */
  name?: string;
  /** Text to display when there are no options */
  noOptionsMessage: (obj: { inputValue: string }) => ReactNode;
  /** Handle blur events on the control */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the select */
  onChange: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void;
  /** Handle focus events on the control */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the input */
  onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
  /** Handle key down events on the select */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  /** Handle the menu opening */
  onMenuOpen: () => void;
  /** Handle the menu closing */
  onMenuClose: () => void;
  /** Fired when the user scrolls to the top of the menu */
  onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
  /** Fired when the user scrolls to the bottom of the menu */
  onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
  /** Allows control of whether the menu is opened when the Select is focused */
  openMenuOnFocus: boolean;
  /** Allows control of whether the menu is opened when the Select is clicked */
  openMenuOnClick: boolean;
  /** Array of options that populate the select menu */
  options: OptionsOrGroups<Option, Group>;
  /** Number of options to jump in menu when page{up|down} keys are used */
  pageSize: number;
  /** Placeholder for the select value */
  placeholder: ReactNode;
  /** Status to relay to screen readers */
  screenReaderStatus: (obj: { count: number }) => string;
  /**
   * Style modifier methods
   *
   * A basic example can be found at the bottom of the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  styles: StylesConfig<Option, IsMulti, Group>;
  /** Theme modifier method */
  theme?: ThemeConfig;
  /** Sets the tabIndex attribute on the input */
  tabIndex: number;
  /** Select the currently focused option when the user presses tab */
  tabSelectsValue: boolean;
  /** Remove all non-essential styles */
  unstyled: boolean;
  /** The value of the select; reflected by the selected option */
  value: PropsValue<Option>;
  /** Sets the form attribute on the input */
  form?: string;
  /** Marks the value-holding input as required for form validation */
  required?: boolean;
}

export const defaultProps = {
  'aria-live': 'polite',
  backspaceRemovesValue: true,
  blurInputOnSelect: isTouchCapable(),
  captureMenuScroll: !isTouchCapable(),
  classNames: {},
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabelBuiltin,
  getOptionLabel: getOptionLabelBuiltin,
  getOptionValue: getOptionValueBuiltin,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabledBuiltin,
  loadingMessage: () => 'Loading...',
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !isMobileDevice(),
  noOptionsMessage: () => 'No options',
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: ({ count }: { count: number }) =>
    `${count} result${count !== 1 ? 's' : ''} available`,
  styles: {},
  tabIndex: 0,
  tabSelectsValue: true,
  unstyled: false,
};

interface State<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  ariaSelection: AriaSelection<Option, IsMulti> | null;
  inputIsHidden: boolean;
  isFocused: boolean;
  focusedOption: Option | null;
  focusedOptionId: string | null;
  focusableOptionsWithIds: FocusableOptionWithId<Option>[];
  focusedValue: Option | null;
  selectValue: Options<Option>;
  clearFocusValueOnUpdate: boolean;
  prevWasFocused: boolean;
  inputIsHiddenAfterUpdate: boolean | null | undefined;
  prevProps: Props<Option, IsMulti, Group> | void;
  instancePrefix: string;
}

interface CategorizedOption<Option> {
  type: 'option';
  data: Option;
  isDisabled: boolean;
  isSelected: boolean;
  label: string;
  value: string;
  index: number;
}

interface FocusableOptionWithId<Option> {
  data: Option;
  id: string;
}

interface CategorizedGroup<Option, Group extends GroupBase<Option>> {
  type: 'group';
  data: Group;
  options: readonly CategorizedOption<Option>[];
  index: number;
}

type CategorizedGroupOrOption<Option, Group extends GroupBase<Option>> =
  | CategorizedGroup<Option, Group>
  | CategorizedOption<Option>;

function toCategorizedOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>,
  index: number
): CategorizedOption<Option> {
  const isDisabled = isOptionDisabled(props, option, selectValue);
  const isSelected = isOptionSelected(props, option, selectValue);
  const label = getOptionLabel(props, option);
  const value = getOptionValue(props, option);

  return {
    type: 'option',
    data: option,
    isDisabled,
    isSelected,
    label,
    value,
    index,
  };
}

function buildCategorizedOptions<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  selectValue: Options<Option>
): CategorizedGroupOrOption<Option, Group>[] {
  return props.options
    .map((groupOrOption, groupOrOptionIndex) => {
      if ('options' in groupOrOption) {
        const categorizedOptions = groupOrOption.options
          .map((option, optionIndex) =>
            toCategorizedOption(props, option, selectValue, optionIndex)
          )
          .filter((categorizedOption) => isFocusable(props, categorizedOption));
        return categorizedOptions.length > 0
          ? {
              type: 'group' as const,
              data: groupOrOption,
              options: categorizedOptions,
              index: groupOrOptionIndex,
            }
          : undefined;
      }
      const categorizedOption = toCategorizedOption(
        props,
        groupOrOption,
        selectValue,
        groupOrOptionIndex
      );
      return isFocusable(props, categorizedOption)
        ? categorizedOption
        : undefined;
    })
    .filter(notNullish);
}

function buildFocusableOptionsFromCategorizedOptions<
  Option,
  Group extends GroupBase<Option>
>(categorizedOptions: readonly CategorizedGroupOrOption<Option, Group>[]) {
  return categorizedOptions.reduce<Option[]>(
    (optionsAccumulator, categorizedOption) => {
      if (categorizedOption.type === 'group') {
        optionsAccumulator.push(
          ...categorizedOption.options.map((option) => option.data)
        );
      } else {
        optionsAccumulator.push(categorizedOption.data);
      }
      return optionsAccumulator;
    },
    []
  );
}

function buildFocusableOptionsWithIds<Option, Group extends GroupBase<Option>>(
  categorizedOptions: readonly CategorizedGroupOrOption<Option, Group>[],
  optionId: string
) {
  return categorizedOptions.reduce<FocusableOptionWithId<Option>[]>(
    (optionsAccumulator, categorizedOption) => {
      if (categorizedOption.type === 'group') {
        optionsAccumulator.push(
          ...categorizedOption.options.map((option) => ({
            data: option.data,
            id: `${optionId}-${categorizedOption.index}-${option.index}`,
          }))
        );
      } else {
        optionsAccumulator.push({
          data: categorizedOption.data,
          id: `${optionId}-${categorizedOption.index}`,
        });
      }
      return optionsAccumulator;
    },
    []
  );
}

function buildFocusableOptions<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(props: Props<Option, IsMulti, Group>, selectValue: Options<Option>) {
  return buildFocusableOptionsFromCategorizedOptions(
    buildCategorizedOptions(props, selectValue)
  );
}

function isFocusable<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  categorizedOption: CategorizedOption<Option>
) {
  const { inputValue = '' } = props;
  const { data, isSelected, label, value } = categorizedOption;

  return (
    (!shouldHideSelectedOptions(props) || !isSelected) &&
    filterOption(props, { label, value, data }, inputValue)
  );
}

function getNextFocusedValue<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(state: State<Option, IsMulti, Group>, nextSelectValue: Options<Option>) {
  const { focusedValue, selectValue: lastSelectValue } = state;
  const lastFocusedIndex = lastSelectValue.indexOf(focusedValue!);
  if (lastFocusedIndex > -1) {
    const nextFocusedIndex = nextSelectValue.indexOf(focusedValue!);
    if (nextFocusedIndex > -1) {
      // the focused value is still in the selectValue, return it
      return focusedValue;
    } else if (lastFocusedIndex < nextSelectValue.length) {
      // the focusedValue is not present in the next selectValue array by
      // reference, so return the new value at the same index
      return nextSelectValue[lastFocusedIndex];
    }
  }
  return null;
}

function getNextFocusedOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(state: State<Option, IsMulti, Group>, options: Options<Option>) {
  const { focusedOption: lastFocusedOption } = state;
  return lastFocusedOption && options.indexOf(lastFocusedOption) > -1
    ? lastFocusedOption
    : options[0];
}

const getFocusedOptionId = <Option,>(
  focusableOptionsWithIds: FocusableOptionWithId<Option>[],
  focusedOption: Option
) => {
  const focusedOptionId = focusableOptionsWithIds.find(
    (option) => option.data === focusedOption
  )?.id;
  return focusedOptionId || null;
};

const getOptionLabel = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionLabel(data);
};
const getOptionValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionValue(data);
};

function isOptionDisabled<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  return typeof props.isOptionDisabled === 'function'
    ? props.isOptionDisabled(option, selectValue)
    : false;
}
function isOptionSelected<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  if (selectValue.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }
  const candidate = getOptionValue(props, option);
  return selectValue.some((i) => getOptionValue(props, i) === candidate);
}
function filterOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: FilterOptionOption<Option>,
  inputValue: string
) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}

const shouldHideSelectedOptions = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
) => {
  const { hideSelectedOptions, isMulti } = props;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};

let instanceId = 1;

export default class Select<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Component<
  Props<Option, IsMulti, Group>,
  State<Option, IsMulti, Group>
> {
  static defaultProps = defaultProps;
  state: State<Option, IsMulti, Group> = {
    ariaSelection: null,
    focusedOption: null,
    focusedOptionId: null,
    focusableOptionsWithIds: [],
    focusedValue: null,
    inputIsHidden: false,
    isFocused: false,
    selectValue: [],
    clearFocusValueOnUpdate: false,
    prevWasFocused: false,
    inputIsHiddenAfterUpdate: undefined,
    prevProps: undefined,
    instancePrefix: '',
  };

  // Misc. Instance Properties
  // ------------------------------

  blockOptionHover = false;
  isComposing = false;
  commonProps: any; // TODO
  initialTouchX = 0;
  initialTouchY = 0;
  openAfterFocus = false;
  scrollToFocusedOptionOnUpdate = false;
  userIsDragging?: boolean;
  isAppleDevice = isAppleDevice();

  // Refs
  // ------------------------------

  controlRef: HTMLDivElement | null = null;
  getControlRef: RefCallback<HTMLDivElement> = (ref) => {
    this.controlRef = ref;
  };
  focusedOptionRef: HTMLDivElement | null = null;
  getFocusedOptionRef: RefCallback<HTMLDivElement> = (ref) => {
    this.focusedOptionRef = ref;
  };
  menuListRef: HTMLDivElement | null = null;
  getMenuListRef: RefCallback<HTMLDivElement> = (ref) => {
    this.menuListRef = ref;
  };
  inputRef: HTMLInputElement | null = null;
  getInputRef: RefCallback<HTMLInputElement> = (ref) => {
    this.inputRef = ref;
  };

  // Lifecycle
  // ------------------------------

  constructor(props: Props<Option, IsMulti, Group>) {
    super(props);
    this.state.instancePrefix =
      'react-select-' + (this.props.instanceId || ++instanceId);
    this.state.selectValue = cleanValue(props.value);
    // Set focusedOption if menuIsOpen is set on init (e.g. defaultMenuIsOpen)
    if (props.menuIsOpen && this.state.selectValue.length) {
      const focusableOptionsWithIds: FocusableOptionWithId<Option>[] =
        this.getFocusableOptionsWithIds();
      const focusableOptions = this.buildFocusableOptions();
      const optionIndex = focusableOptions.indexOf(this.state.selectValue[0]);
      this.state.focusableOptionsWithIds = focusableOptionsWithIds;
      this.state.focusedOption = focusableOptions[optionIndex];
      this.state.focusedOptionId = getFocusedOptionId(
        focusableOptionsWithIds,
        focusableOptions[optionIndex]
      );
    }
  }

  static getDerivedStateFromProps(
    props: Props<unknown, boolean, GroupBase<unknown>>,
    state: State<unknown, boolean, GroupBase<unknown>>
  ) {
    const {
      prevProps,
      clearFocusValueOnUpdate,
      inputIsHiddenAfterUpdate,
      ariaSelection,
      isFocused,
      prevWasFocused,
      instancePrefix,
    } = state;
    const { options, value, menuIsOpen, inputValue, isMulti } = props;
    const selectValue = cleanValue(value);
    let newMenuOptionsState = {};
    if (
      prevProps &&
      (value !== prevProps.value ||
        options !== prevProps.options ||
        menuIsOpen !== prevProps.menuIsOpen ||
        inputValue !== prevProps.inputValue)
    ) {
      const focusableOptions = menuIsOpen
        ? buildFocusableOptions(props, selectValue)
        : [];

      const focusableOptionsWithIds = menuIsOpen
        ? buildFocusableOptionsWithIds(
            buildCategorizedOptions(props, selectValue),
            `${instancePrefix}-option`
          )
        : [];

      const focusedValue = clearFocusValueOnUpdate
        ? getNextFocusedValue(state, selectValue)
        : null;
      const focusedOption = getNextFocusedOption(state, focusableOptions);
      const focusedOptionId = getFocusedOptionId(
        focusableOptionsWithIds,
        focusedOption
      );

      newMenuOptionsState = {
        selectValue,
        focusedOption,
        focusedOptionId,
        focusableOptionsWithIds,
        focusedValue,
        clearFocusValueOnUpdate: false,
      };
    }
    // some updates should toggle the state of the input visibility
    const newInputIsHiddenState =
      inputIsHiddenAfterUpdate != null && props !== prevProps
        ? {
            inputIsHidden: inputIsHiddenAfterUpdate,
            inputIsHiddenAfterUpdate: undefined,
          }
        : {};

    let newAriaSelection = ariaSelection;

    let hasKeptFocus = isFocused && prevWasFocused;

    if (isFocused && !hasKeptFocus) {
      // If `value` or `defaultValue` props are not empty then announce them
      // when the Select is initially focused
      newAriaSelection = {
        value: valueTernary(isMulti, selectValue, selectValue[0] || null),
        options: selectValue,
        action: 'initial-input-focus',
      };

      hasKeptFocus = !prevWasFocused;
    }

    // If the 'initial-input-focus' action has been set already
    // then reset the ariaSelection to null
    if (ariaSelection?.action === 'initial-input-focus') {
      newAriaSelection = null;
    }

    return {
      ...newMenuOptionsState,
      ...newInputIsHiddenState,
      prevProps: props,
      ariaSelection: newAriaSelection,
      prevWasFocused: hasKeptFocus,
    };
  }
  componentDidMount() {
    this.startListeningComposition();
    this.startListeningToTouch();

    if (this.props.closeMenuOnScroll && document && document.addEventListener) {
      // Listen to all scroll events, and filter them out inside of 'onScroll'
      document.addEventListener('scroll', this.onScroll, true);
    }

    if (this.props.autoFocus) {
      this.focusInput();
    }

    // Scroll focusedOption into view if menuIsOpen is set on mount (e.g. defaultMenuIsOpen)
    if (
      this.props.menuIsOpen &&
      this.state.focusedOption &&
      this.menuListRef &&
      this.focusedOptionRef
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
    }
  }
  componentDidUpdate(prevProps: Props<Option, IsMulti, Group>) {
    const { isDisabled, menuIsOpen } = this.props;
    const { isFocused } = this.state;

    if (
      // ensure focus is restored correctly when the control becomes enabled
      (isFocused && !isDisabled && prevProps.isDisabled) ||
      // ensure focus is on the Input when the menu opens
      (isFocused && menuIsOpen && !prevProps.menuIsOpen)
    ) {
      this.focusInput();
    }

    if (isFocused && isDisabled && !prevProps.isDisabled) {
      // ensure select state gets blurred in case Select is programmatically disabled while focused
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isFocused: false }, this.onMenuClose);
    } else if (
      !isFocused &&
      !isDisabled &&
      prevProps.isDisabled &&
      this.inputRef === document.activeElement
    ) {
      // ensure select state gets focused in case Select is programatically re-enabled while focused (Firefox)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isFocused: true });
    }

    // scroll the focused option into view if necessary
    if (
      this.menuListRef &&
      this.focusedOptionRef &&
      this.scrollToFocusedOptionOnUpdate
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
      this.scrollToFocusedOptionOnUpdate = false;
    }
  }
  componentWillUnmount() {
    this.stopListeningComposition();
    this.stopListeningToTouch();
    document.removeEventListener('scroll', this.onScroll, true);
  }

  // ==============================
  // Consumer Handlers
  // ==============================

  onMenuOpen() {
    this.props.onMenuOpen();
  }
  onMenuClose() {
    this.onInputChange('', {
      action: 'menu-close',
      prevInputValue: this.props.inputValue,
    });

    this.props.onMenuClose();
  }
  onInputChange(newValue: string, actionMeta: InputActionMeta) {
    this.props.onInputChange(newValue, actionMeta);
  }

  // ==============================
  // Methods
  // ==============================

  focusInput() {
    if (!this.inputRef) return;
    this.inputRef.focus();
  }
  blurInput() {
    if (!this.inputRef) return;
    this.inputRef.blur();
  }

  // aliased for consumers
  focus = this.focusInput;
  blur = this.blurInput;

  openMenu(focusOption: 'first' | 'last') {
    const { selectValue, isFocused } = this.state;
    const focusableOptions = this.buildFocusableOptions();
    let openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;

    if (!this.props.isMulti) {
      const selectedIndex = focusableOptions.indexOf(selectValue[0]);
      if (selectedIndex > -1) {
        openAtIndex = selectedIndex;
      }
    }

    // only scroll if the menu isn't already open
    this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);

    this.setState(
      {
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex],
        focusedOptionId: this.getFocusedOptionId(focusableOptions[openAtIndex]),
      },
      () => this.onMenuOpen()
    );
  }

  focusValue(direction: 'previous' | 'next') {
    const { selectValue, focusedValue } = this.state;

    // Only multiselects support value focusing
    if (!this.props.isMulti) return;

    this.setState({
      focusedOption: null,
    });

    let focusedIndex = selectValue.indexOf(focusedValue!);
    if (!focusedValue) {
      focusedIndex = -1;
    }

    const lastIndex = selectValue.length - 1;
    let nextFocus = -1;
    if (!selectValue.length) return;

    switch (direction) {
      case 'previous':
        if (focusedIndex === 0) {
          // don't cycle from the start to the end
          nextFocus = 0;
        } else if (focusedIndex === -1) {
          // if nothing is focused, focus the last value first
          nextFocus = lastIndex;
        } else {
          nextFocus = focusedIndex - 1;
        }
        break;
      case 'next':
        if (focusedIndex > -1 && focusedIndex < lastIndex) {
          nextFocus = focusedIndex + 1;
        }
        break;
    }
    this.setState({
      inputIsHidden: nextFocus !== -1,
      focusedValue: selectValue[nextFocus],
    });
  }

  focusOption(direction: FocusDirection = 'first') {
    const { pageSize } = this.props;
    const { focusedOption } = this.state;
    const options = this.getFocusableOptions();

    if (!options.length) return;
    let nextFocus = 0; // handles 'first'
    let focusedIndex = options.indexOf(focusedOption!);
    if (!focusedOption) {
      focusedIndex = -1;
    }

    if (direction === 'up') {
      nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
    } else if (direction === 'down') {
      nextFocus = (focusedIndex + 1) % options.length;
    } else if (direction === 'pageup') {
      nextFocus = focusedIndex - pageSize;
      if (nextFocus < 0) nextFocus = 0;
    } else if (direction === 'pagedown') {
      nextFocus = focusedIndex + pageSize;
      if (nextFocus > options.length - 1) nextFocus = options.length - 1;
    } else if (direction === 'last') {
      nextFocus = options.length - 1;
    }
    this.scrollToFocusedOptionOnUpdate = true;
    this.setState({
      focusedOption: options[nextFocus],
      focusedValue: null,
      focusedOptionId: this.getFocusedOptionId(options[nextFocus]),
    });
  }
  onChange = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    const { onChange, name } = this.props;
    actionMeta.name = name;

    this.ariaOnChange(newValue, actionMeta);
    onChange(newValue, actionMeta);
  };
  setValue = (
    newValue: OnChangeValue<Option, IsMulti>,
    action: SetValueAction,
    option?: Option
  ) => {
    const { closeMenuOnSelect, isMulti, inputValue } = this.props;
    this.onInputChange('', { action: 'set-value', prevInputValue: inputValue });
    if (closeMenuOnSelect) {
      this.setState({
        inputIsHiddenAfterUpdate: !isMulti,
      });
      this.onMenuClose();
    }
    // when the select value should change, we should reset focusedValue
    this.setState({ clearFocusValueOnUpdate: true });
    this.onChange(newValue, { action, option });
  };
  selectOption = (newValue: Option) => {
    const { blurInputOnSelect, isMulti, name } = this.props;
    const { selectValue } = this.state;
    const deselected = isMulti && this.isOptionSelected(newValue, selectValue);
    const isDisabled = this.isOptionDisabled(newValue, selectValue);

    if (deselected) {
      const candidate = this.getOptionValue(newValue);
      this.setValue(
        multiValueAsValue(
          selectValue.filter((i) => this.getOptionValue(i) !== candidate)
        ),
        'deselect-option',
        newValue
      );
    } else if (!isDisabled) {
      // Select option if option is not disabled
      if (isMulti) {
        this.setValue(
          multiValueAsValue([...selectValue, newValue]),
          'select-option',
          newValue
        );
      } else {
        this.setValue(singleValueAsValue(newValue), 'select-option');
      }
    } else {
      this.ariaOnChange(singleValueAsValue(newValue), {
        action: 'select-option',
        option: newValue,
        name,
      });
      return;
    }

    if (blurInputOnSelect) {
      this.blurInput();
    }
  };
  removeValue = (removedValue: Option) => {
    const { isMulti } = this.props;
    const { selectValue } = this.state;
    const candidate = this.getOptionValue(removedValue);
    const newValueArray = selectValue.filter(
      (i) => this.getOptionValue(i) !== candidate
    );
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    this.onChange(newValue, { action: 'remove-value', removedValue });
    this.focusInput();
  };
  clearValue = () => {
    const { selectValue } = this.state;
    this.onChange(valueTernary(this.props.isMulti, [], null), {
      action: 'clear',
      removedValues: selectValue,
    });
  };
  popValue = () => {
    const { isMulti } = this.props;
    const { selectValue } = this.state;
    const lastSelectedValue = selectValue[selectValue.length - 1];
    const newValueArray = selectValue.slice(0, selectValue.length - 1);
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    this.onChange(newValue, {
      action: 'pop-value',
      removedValue: lastSelectedValue,
    });
  };

  // ==============================
  // Getters
  // ==============================

  getTheme() {
    // Use the default theme if there are no customisations.
    if (!this.props.theme) {
      return defaultTheme;
    }
    // If the theme prop is a function, assume the function
    // knows how to merge the passed-in default theme with
    // its own modifications.
    if (typeof this.props.theme === 'function') {
      return this.props.theme(defaultTheme);
    }
    // Otherwise, if a plain theme object was passed in,
    // overlay it with the default theme.
    return {
      ...defaultTheme,
      ...this.props.theme,
    };
  }

  getFocusedOptionId = (focusedOption: Option) => {
    return getFocusedOptionId(
      this.state.focusableOptionsWithIds,
      focusedOption
    );
  };

  getFocusableOptionsWithIds = () => {
    return buildFocusableOptionsWithIds(
      buildCategorizedOptions(this.props, this.state.selectValue),
      this.getElementId('option')
    );
  };

  getValue = () => this.state.selectValue;

  cx = (...args: any) => classNames(this.props.classNamePrefix, ...args);

  getCommonProps() {
    const {
      clearValue,
      cx,
      getStyles,
      getClassNames,
      getValue,
      selectOption,
      setValue,
      props,
    } = this;
    const { isMulti, isRtl, options } = props;
    const hasValue = this.hasValue();

    return {
      clearValue,
      cx,
      getStyles,
      getClassNames,
      getValue,
      hasValue,
      isMulti,
      isRtl,
      options,
      selectOption,
      selectProps: props,
      setValue,
      theme: this.getTheme(),
    };
  }

  getOptionLabel = (data: Option): string => {
    return getOptionLabel(this.props, data);
  };
  getOptionValue = (data: Option): string => {
    return getOptionValue(this.props, data);
  };
  getStyles = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    props: StylesProps<Option, IsMulti, Group>[Key]
  ) => {
    const { unstyled } = this.props;
    const base = defaultStyles[key](props as any, unstyled);
    base.boxSizing = 'border-box';
    const custom = this.props.styles[key];
    return custom ? custom(base, props as any) : base;
  };
  getClassNames = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    props: StylesProps<Option, IsMulti, Group>[Key]
  ) => this.props.classNames[key]?.(props as any);
  getElementId = (
    element:
      | 'group'
      | 'input'
      | 'listbox'
      | 'option'
      | 'placeholder'
      | 'live-region'
  ) => {
    return `${this.state.instancePrefix}-${element}`;
  };

  getComponents = () => {
    return defaultComponents(this.props);
  };

  buildCategorizedOptions = () =>
    buildCategorizedOptions(this.props, this.state.selectValue);
  getCategorizedOptions = () =>
    this.props.menuIsOpen ? this.buildCategorizedOptions() : [];
  buildFocusableOptions = () =>
    buildFocusableOptionsFromCategorizedOptions(this.buildCategorizedOptions());
  getFocusableOptions = () =>
    this.props.menuIsOpen ? this.buildFocusableOptions() : [];

  // ==============================
  // Helpers
  // ==============================

  ariaOnChange = (
    value: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    this.setState({ ariaSelection: { value, ...actionMeta } });
  };

  hasValue() {
    const { selectValue } = this.state;
    return selectValue.length > 0;
  }
  hasOptions() {
    return !!this.getFocusableOptions().length;
  }
  isClearable(): boolean {
    const { isClearable, isMulti } = this.props;

    // single select, by default, IS NOT clearable
    // multi select, by default, IS clearable
    if (isClearable === undefined) return isMulti;

    return isClearable;
  }
  isOptionDisabled(option: Option, selectValue: Options<Option>): boolean {
    return isOptionDisabled(this.props, option, selectValue);
  }
  isOptionSelected(option: Option, selectValue: Options<Option>): boolean {
    return isOptionSelected(this.props, option, selectValue);
  }
  filterOption(option: FilterOptionOption<Option>, inputValue: string) {
    return filterOption(this.props, option, inputValue);
  }
  formatOptionLabel(
    data: Option,
    context: FormatOptionLabelContext
  ): ReactNode {
    if (typeof this.props.formatOptionLabel === 'function') {
      const { inputValue } = this.props;
      const { selectValue } = this.state;
      return this.props.formatOptionLabel(data, {
        context,
        inputValue,
        selectValue,
      });
    } else {
      return this.getOptionLabel(data);
    }
  }
  formatGroupLabel(data: Group) {
    return this.props.formatGroupLabel(data);
  }

  // ==============================
  // Mouse Handlers
  // ==============================

  onMenuMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.focusInput();
  };
  onMenuMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    this.blockOptionHover = false;
  };
  onControlMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // Event captured by dropdown indicator
    if (event.defaultPrevented) {
      return;
    }
    const { openMenuOnClick } = this.props;
    if (!this.state.isFocused) {
      if (openMenuOnClick) {
        this.openAfterFocus = true;
      }
      this.focusInput();
    } else if (!this.props.menuIsOpen) {
      if (openMenuOnClick) {
        this.openMenu('first');
      }
    } else {
      if (
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        this.onMenuClose();
      }
    }
    if (
      (event.target as HTMLElement).tagName !== 'INPUT' &&
      (event.target as HTMLElement).tagName !== 'TEXTAREA'
    ) {
      event.preventDefault();
    }
  };
  onDropdownIndicatorMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // ignore mouse events that weren't triggered by the primary button
    if (
      event &&
      event.type === 'mousedown' &&
      (event as React.MouseEvent<HTMLDivElement>).button !== 0
    ) {
      return;
    }
    if (this.props.isDisabled) return;
    const { isMulti, menuIsOpen } = this.props;
    this.focusInput();
    if (menuIsOpen) {
      this.setState({ inputIsHiddenAfterUpdate: !isMulti });
      this.onMenuClose();
    } else {
      this.openMenu('first');
    }
    event.preventDefault();
  };
  onClearIndicatorMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // ignore mouse events that weren't triggered by the primary button
    if (
      event &&
      event.type === 'mousedown' &&
      (event as React.MouseEvent<HTMLDivElement>).button !== 0
    ) {
      return;
    }
    this.clearValue();
    event.preventDefault();
    this.openAfterFocus = false;
    if (event.type === 'touchend') {
      this.focusInput();
    } else {
      setTimeout(() => this.focusInput());
    }
  };
  onScroll = (event: Event) => {
    if (typeof this.props.closeMenuOnScroll === 'boolean') {
      if (
        event.target instanceof HTMLElement &&
        isDocumentElement(event.target)
      ) {
        this.props.onMenuClose();
      }
    } else if (typeof this.props.closeMenuOnScroll === 'function') {
      if (this.props.closeMenuOnScroll(event)) {
        this.props.onMenuClose();
      }
    }
  };

  // ==============================
  // Composition Handlers
  // ==============================

  startListeningComposition() {
    if (document && document.addEventListener) {
      document.addEventListener(
        'compositionstart',
        this.onCompositionStart,
        false
      );
      document.addEventListener('compositionend', this.onCompositionEnd, false);
    }
  }
  stopListeningComposition() {
    if (document && document.removeEventListener) {
      document.removeEventListener('compositionstart', this.onCompositionStart);
      document.removeEventListener('compositionend', this.onCompositionEnd);
    }
  }
  onCompositionStart = () => {
    this.isComposing = true;
  };
  onCompositionEnd = () => {
    this.isComposing = false;
  };

  // ==============================
  // Touch Handlers
  // ==============================

  startListeningToTouch() {
    if (document && document.addEventListener) {
      document.addEventListener('touchstart', this.onTouchStart, false);
      document.addEventListener('touchmove', this.onTouchMove, false);
      document.addEventListener('touchend', this.onTouchEnd, false);
    }
  }
  stopListeningToTouch() {
    if (document && document.removeEventListener) {
      document.removeEventListener('touchstart', this.onTouchStart);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
  }
  onTouchStart = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    this.initialTouchX = touch.clientX;
    this.initialTouchY = touch.clientY;
    this.userIsDragging = false;
  };
  onTouchMove = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    const deltaX = Math.abs(touch.clientX - this.initialTouchX);
    const deltaY = Math.abs(touch.clientY - this.initialTouchY);
    const moveThreshold = 5;

    this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
  };
  onTouchEnd = (event: TouchEvent) => {
    if (this.userIsDragging) return;

    // close the menu if the user taps outside
    // we're checking on event.target here instead of event.currentTarget, because we want to assert information
    // on events on child elements, not the document (which we've attached this handler to).
    if (
      this.controlRef &&
      !this.controlRef.contains(event.target as Node) &&
      this.menuListRef &&
      !this.menuListRef.contains(event.target as Node)
    ) {
      this.blurInput();
    }

    // reset move vars
    this.initialTouchX = 0;
    this.initialTouchY = 0;
  };
  onControlTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;
    this.onControlMouseDown(event);
  };
  onClearIndicatorTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;

    this.onClearIndicatorMouseDown(event);
  };
  onDropdownIndicatorTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    if (this.userIsDragging) return;

    this.onDropdownIndicatorMouseDown(event);
  };

  // ==============================
  // Focus Handlers
  // ==============================

  handleInputChange: FormEventHandler<HTMLInputElement> = (event) => {
    const { inputValue: prevInputValue } = this.props;
    const inputValue = event.currentTarget.value;
    this.setState({ inputIsHiddenAfterUpdate: false });
    this.onInputChange(inputValue, { action: 'input-change', prevInputValue });
    if (!this.props.menuIsOpen) {
      this.onMenuOpen();
    }
  };
  onInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
    this.setState({
      inputIsHiddenAfterUpdate: false,
      isFocused: true,
    });
    if (this.openAfterFocus || this.props.openMenuOnFocus) {
      this.openMenu('first');
    }
    this.openAfterFocus = false;
  };
  onInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const { inputValue: prevInputValue } = this.props;
    if (this.menuListRef && this.menuListRef.contains(document.activeElement)) {
      this.inputRef!.focus();
      return;
    }
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.onInputChange('', { action: 'input-blur', prevInputValue });
    this.onMenuClose();
    this.setState({
      focusedValue: null,
      isFocused: false,
    });
  };
  onOptionHover = (focusedOption: Option) => {
    if (this.blockOptionHover || this.state.focusedOption === focusedOption) {
      return;
    }
    const options = this.getFocusableOptions();
    const focusedOptionIndex = options.indexOf(focusedOption!);
    this.setState({
      focusedOption,
      focusedOptionId:
        focusedOptionIndex > -1 ? this.getFocusedOptionId(focusedOption) : null,
    });
  };
  shouldHideSelectedOptions = () => {
    return shouldHideSelectedOptions(this.props);
  };

  // If the hidden input gets focus through form submit,
  // redirect focus to focusable input.
  onValueInputFocus: FocusEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.focus();
  };

  // ==============================
  // Keyboard Handlers
  // ==============================

  onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const {
      isMulti,
      backspaceRemovesValue,
      escapeClearsValue,
      inputValue,
      isClearable,
      isDisabled,
      menuIsOpen,
      onKeyDown,
      tabSelectsValue,
      openMenuOnFocus,
    } = this.props;
    const { focusedOption, focusedValue, selectValue } = this.state;

    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    this.blockOptionHover = true;
    switch (event.key) {
      case 'ArrowLeft':
        if (!isMulti || inputValue) return;
        this.focusValue('previous');
        break;
      case 'ArrowRight':
        if (!isMulti || inputValue) return;
        this.focusValue('next');
        break;
      case 'Delete':
      case 'Backspace':
        if (inputValue) return;
        if (focusedValue) {
          this.removeValue(focusedValue);
        } else {
          if (!backspaceRemovesValue) return;
          if (isMulti) {
            this.popValue();
          } else if (isClearable) {
            this.clearValue();
          }
        }
        break;
      case 'Tab':
        if (this.isComposing) return;

        if (
          event.shiftKey ||
          !menuIsOpen ||
          !tabSelectsValue ||
          !focusedOption ||
          // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          (openMenuOnFocus && this.isOptionSelected(focusedOption, selectValue))
        ) {
          return;
        }
        this.selectOption(focusedOption);
        break;
      case 'Enter':
        if (event.keyCode === 229) {
          // ignore the keydown event from an Input Method Editor(IME)
          // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
          break;
        }
        if (menuIsOpen) {
          if (!focusedOption) return;
          if (this.isComposing) return;
          this.selectOption(focusedOption);
          break;
        }
        return;
      case 'Escape':
        if (menuIsOpen) {
          this.setState({
            inputIsHiddenAfterUpdate: false,
          });
          this.onInputChange('', {
            action: 'menu-close',
            prevInputValue: inputValue,
          });
          this.onMenuClose();
        } else if (isClearable && escapeClearsValue) {
          this.clearValue();
        }
        break;
      case ' ': // space
        if (inputValue) {
          return;
        }
        if (!menuIsOpen) {
          this.openMenu('first');
          break;
        }
        if (!focusedOption) return;
        this.selectOption(focusedOption);
        break;
      case 'ArrowUp':
        if (menuIsOpen) {
          this.focusOption('up');
        } else {
          this.openMenu('last');
        }
        break;
      case 'ArrowDown':
        if (menuIsOpen) {
          this.focusOption('down');
        } else {
          this.openMenu('first');
        }
        break;
      case 'PageUp':
        if (!menuIsOpen) return;
        this.focusOption('pageup');
        break;
      case 'PageDown':
        if (!menuIsOpen) return;
        this.focusOption('pagedown');
        break;
      case 'Home':
        if (!menuIsOpen) return;
        this.focusOption('first');
        break;
      case 'End':
        if (!menuIsOpen) return;
        this.focusOption('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // ==============================
  // Renderers
  // ==============================
  renderInput() {
    const {
      isDisabled,
      isSearchable,
      inputId,
      inputValue,
      tabIndex,
      form,
      menuIsOpen,
      required,
    } = this.props;
    const { Input } = this.getComponents();
    const { inputIsHidden, ariaSelection } = this.state;
    const { commonProps } = this;

    const id = inputId || this.getElementId('input');

    // aria attributes makes the JSX "noisy", separated for clarity
    const ariaAttributes = {
      'aria-autocomplete': 'list' as const,
      'aria-expanded': menuIsOpen,
      'aria-haspopup': true,
      'aria-errormessage': this.props['aria-errormessage'],
      'aria-invalid': this.props['aria-invalid'],
      'aria-label': this.props['aria-label'],
      'aria-labelledby': this.props['aria-labelledby'],
      'aria-required': required,
      role: 'combobox',
      'aria-activedescendant': this.isAppleDevice
        ? undefined
        : this.state.focusedOptionId || '',

      ...(menuIsOpen && {
        'aria-controls': this.getElementId('listbox'),
      }),
      ...(!isSearchable && {
        'aria-readonly': true,
      }),
      ...(this.hasValue()
        ? ariaSelection?.action === 'initial-input-focus' && {
            'aria-describedby': this.getElementId('live-region'),
          }
        : {
            'aria-describedby': this.getElementId('placeholder'),
          }),
    };

    if (!isSearchable) {
      // use a dummy input to maintain focus/blur functionality
      return (
        <DummyInput
          id={id}
          innerRef={this.getInputRef}
          onBlur={this.onInputBlur}
          onChange={noop}
          onFocus={this.onInputFocus}
          disabled={isDisabled}
          tabIndex={tabIndex}
          inputMode="none"
          form={form}
          value=""
          {...ariaAttributes}
        />
      );
    }

    return (
      <Input
        {...commonProps}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        id={id}
        innerRef={this.getInputRef}
        isDisabled={isDisabled}
        isHidden={inputIsHidden}
        onBlur={this.onInputBlur}
        onChange={this.handleInputChange}
        onFocus={this.onInputFocus}
        spellCheck="false"
        tabIndex={tabIndex}
        form={form}
        type="text"
        value={inputValue}
        {...ariaAttributes}
      />
    );
  }
  renderPlaceholderOrValue() {
    const {
      MultiValue,
      MultiValueContainer,
      MultiValueLabel,
      MultiValueRemove,
      SingleValue,
      Placeholder,
    } = this.getComponents();
    const { commonProps } = this;
    const {
      controlShouldRenderValue,
      isDisabled,
      isMulti,
      inputValue,
      placeholder,
    } = this.props;
    const { selectValue, focusedValue, isFocused } = this.state;

    if (!this.hasValue() || !controlShouldRenderValue) {
      return inputValue ? null : (
        <Placeholder
          {...commonProps}
          key="placeholder"
          isDisabled={isDisabled}
          isFocused={isFocused}
          innerProps={{ id: this.getElementId('placeholder') }}
        >
          {placeholder}
        </Placeholder>
      );
    }

    if (isMulti) {
      return selectValue.map((opt, index) => {
        const isOptionFocused = opt === focusedValue;
        const key = `${this.getOptionLabel(opt)}-${this.getOptionValue(opt)}`;

        return (
          <MultiValue
            {...commonProps}
            components={{
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove,
            }}
            isFocused={isOptionFocused}
            isDisabled={isDisabled}
            key={key}
            index={index}
            removeProps={{
              onClick: () => this.removeValue(opt),
              onTouchEnd: () => this.removeValue(opt),
              onMouseDown: (e) => {
                e.preventDefault();
              },
            }}
            data={opt}
          >
            {this.formatOptionLabel(opt, 'value')}
          </MultiValue>
        );
      });
    }

    if (inputValue) {
      return null;
    }

    const singleValue = selectValue[0];
    return (
      <SingleValue {...commonProps} data={singleValue} isDisabled={isDisabled}>
        {this.formatOptionLabel(singleValue, 'value')}
      </SingleValue>
    );
  }
  renderClearIndicator() {
    const { ClearIndicator } = this.getComponents();
    const { commonProps } = this;
    const { isDisabled, isLoading } = this.props;
    const { isFocused } = this.state;

    if (
      !this.isClearable() ||
      !ClearIndicator ||
      isDisabled ||
      !this.hasValue() ||
      isLoading
    ) {
      return null;
    }

    const innerProps = {
      onMouseDown: this.onClearIndicatorMouseDown,
      onTouchEnd: this.onClearIndicatorTouchEnd,
      'aria-hidden': 'true',
    };

    return (
      <ClearIndicator
        {...commonProps}
        innerProps={innerProps}
        isFocused={isFocused}
      />
    );
  }
  renderLoadingIndicator() {
    const { LoadingIndicator } = this.getComponents();
    const { commonProps } = this;
    const { isDisabled, isLoading } = this.props;
    const { isFocused } = this.state;

    if (!LoadingIndicator || !isLoading) return null;

    const innerProps = { 'aria-hidden': 'true' };
    return (
      <LoadingIndicator
        {...commonProps}
        innerProps={innerProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderIndicatorSeparator() {
    const { DropdownIndicator, IndicatorSeparator } = this.getComponents();

    // separator doesn't make sense without the dropdown indicator
    if (!DropdownIndicator || !IndicatorSeparator) return null;

    const { commonProps } = this;
    const { isDisabled } = this.props;
    const { isFocused } = this.state;

    return (
      <IndicatorSeparator
        {...commonProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderDropdownIndicator() {
    const { DropdownIndicator } = this.getComponents();
    if (!DropdownIndicator) return null;
    const { commonProps } = this;
    const { isDisabled } = this.props;
    const { isFocused } = this.state;

    const innerProps = {
      onMouseDown: this.onDropdownIndicatorMouseDown,
      onTouchEnd: this.onDropdownIndicatorTouchEnd,
      'aria-hidden': 'true',
    };

    return (
      <DropdownIndicator
        {...commonProps}
        innerProps={innerProps}
        isDisabled={isDisabled}
        isFocused={isFocused}
      />
    );
  }
  renderMenu() {
    const {
      Group,
      GroupHeading,
      Menu,
      MenuList,
      MenuPortal,
      LoadingMessage,
      NoOptionsMessage,
      Option,
    } = this.getComponents();
    const { commonProps } = this;
    const { focusedOption } = this.state;
    const {
      captureMenuScroll,
      inputValue,
      isLoading,
      loadingMessage,
      minMenuHeight,
      maxMenuHeight,
      menuIsOpen,
      menuPlacement,
      menuPosition,
      menuPortalTarget,
      menuShouldBlockScroll,
      menuShouldScrollIntoView,
      noOptionsMessage,
      onMenuScrollToTop,
      onMenuScrollToBottom,
    } = this.props;

    if (!menuIsOpen) return null;

    // TODO: Internal Option Type here
    const render = (props: CategorizedOption<Option>, id: string) => {
      const { type, data, isDisabled, isSelected, label, value } = props;
      const isFocused = focusedOption === data;
      const onHover = isDisabled ? undefined : () => this.onOptionHover(data);
      const onSelect = isDisabled ? undefined : () => this.selectOption(data);
      const optionId = `${this.getElementId('option')}-${id}`;
      const innerProps = {
        id: optionId,
        onClick: onSelect,
        onMouseMove: onHover,
        onMouseOver: onHover,
        tabIndex: -1,
        role: 'option',
        'aria-selected': this.isAppleDevice ? undefined : isSelected, // is not supported on Apple devices
      };

      return (
        <Option
          {...commonProps}
          innerProps={innerProps}
          data={data}
          isDisabled={isDisabled}
          isSelected={isSelected}
          key={optionId}
          label={label}
          type={type}
          value={value}
          isFocused={isFocused}
          innerRef={isFocused ? this.getFocusedOptionRef : undefined}
        >
          {this.formatOptionLabel(props.data, 'menu')}
        </Option>
      );
    };

    let menuUI: ReactNode;

    if (this.hasOptions()) {
      menuUI = this.getCategorizedOptions().map((item) => {
        if (item.type === 'group') {
          const { data, options, index: groupIndex } = item;
          const groupId = `${this.getElementId('group')}-${groupIndex}`;
          const headingId = `${groupId}-heading`;

          return (
            <Group
              {...commonProps}
              key={groupId}
              data={data}
              options={options}
              Heading={GroupHeading}
              headingProps={{
                id: headingId,
                data: item.data,
              }}
              label={this.formatGroupLabel(item.data)}
            >
              {item.options.map((option) =>
                render(option, `${groupIndex}-${option.index}`)
              )}
            </Group>
          );
        } else if (item.type === 'option') {
          return render(item, `${item.index}`);
        }
      });
    } else if (isLoading) {
      const message = loadingMessage({ inputValue });
      if (message === null) return null;
      menuUI = <LoadingMessage {...commonProps}>{message}</LoadingMessage>;
    } else {
      const message = noOptionsMessage({ inputValue });
      if (message === null) return null;
      menuUI = <NoOptionsMessage {...commonProps}>{message}</NoOptionsMessage>;
    }
    const menuPlacementProps = {
      minMenuHeight,
      maxMenuHeight,
      menuPlacement,
      menuPosition,
      menuShouldScrollIntoView,
    };

    const menuElement = (
      <MenuPlacer {...commonProps} {...menuPlacementProps}>
        {({ ref, placerProps: { placement, maxHeight } }) => (
          <Menu
            {...commonProps}
            {...menuPlacementProps}
            innerRef={ref}
            innerProps={{
              onMouseDown: this.onMenuMouseDown,
              onMouseMove: this.onMenuMouseMove,
            }}
            isLoading={isLoading}
            placement={placement}
          >
            <ScrollManager
              captureEnabled={captureMenuScroll}
              onTopArrive={onMenuScrollToTop}
              onBottomArrive={onMenuScrollToBottom}
              lockEnabled={menuShouldBlockScroll}
            >
              {(scrollTargetRef) => (
                <MenuList
                  {...commonProps}
                  innerRef={(instance) => {
                    this.getMenuListRef(instance);
                    scrollTargetRef(instance);
                  }}
                  innerProps={{
                    role: 'listbox',
                    'aria-multiselectable': commonProps.isMulti,
                    id: this.getElementId('listbox'),
                  }}
                  isLoading={isLoading}
                  maxHeight={maxHeight}
                  focusedOption={focusedOption}
                >
                  {menuUI}
                </MenuList>
              )}
            </ScrollManager>
          </Menu>
        )}
      </MenuPlacer>
    );

    // positioning behaviour is almost identical for portalled and fixed,
    // so we use the same component. the actual portalling logic is forked
    // within the component based on `menuPosition`
    return menuPortalTarget || menuPosition === 'fixed' ? (
      <MenuPortal
        {...commonProps}
        appendTo={menuPortalTarget}
        controlElement={this.controlRef}
        menuPlacement={menuPlacement}
        menuPosition={menuPosition}
      >
        {menuElement}
      </MenuPortal>
    ) : (
      menuElement
    );
  }
  renderFormField() {
    const { delimiter, isDisabled, isMulti, name, required } = this.props;
    const { selectValue } = this.state;

    if (required && !this.hasValue() && !isDisabled) {
      return <RequiredInput name={name} onFocus={this.onValueInputFocus} />;
    }

    if (!name || isDisabled) return;

    if (isMulti) {
      if (delimiter) {
        const value = selectValue
          .map((opt) => this.getOptionValue(opt))
          .join(delimiter);
        return <input name={name} type="hidden" value={value} />;
      } else {
        const input =
          selectValue.length > 0 ? (
            selectValue.map((opt, i) => (
              <input
                key={`i-${i}`}
                name={name}
                type="hidden"
                value={this.getOptionValue(opt)}
              />
            ))
          ) : (
            <input name={name} type="hidden" value="" />
          );

        return <div>{input}</div>;
      }
    } else {
      const value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
      return <input name={name} type="hidden" value={value} />;
    }
  }

  renderLiveRegion() {
    const { commonProps } = this;
    const {
      ariaSelection,
      focusedOption,
      focusedValue,
      isFocused,
      selectValue,
    } = this.state;

    const focusableOptions = this.getFocusableOptions();

    return (
      <LiveRegion
        {...commonProps}
        id={this.getElementId('live-region')}
        ariaSelection={ariaSelection}
        focusedOption={focusedOption}
        focusedValue={focusedValue}
        isFocused={isFocused}
        selectValue={selectValue}
        focusableOptions={focusableOptions}
        isAppleDevice={this.isAppleDevice}
      />
    );
  }

  render() {
    const { Control, IndicatorsContainer, SelectContainer, ValueContainer } =
      this.getComponents();

    const { className, id, isDisabled, menuIsOpen } = this.props;
    const { isFocused } = this.state;
    const commonProps = (this.commonProps = this.getCommonProps());

    return (
      <SelectContainer
        {...commonProps}
        className={className}
        innerProps={{
          id: id,
          onKeyDown: this.onKeyDown,
        }}
        isDisabled={isDisabled}
        isFocused={isFocused}
      >
        {this.renderLiveRegion()}
        <Control
          {...commonProps}
          innerRef={this.getControlRef}
          innerProps={{
            onMouseDown: this.onControlMouseDown,
            onTouchEnd: this.onControlTouchEnd,
          }}
          isDisabled={isDisabled}
          isFocused={isFocused}
          menuIsOpen={menuIsOpen}
        >
          <ValueContainer {...commonProps} isDisabled={isDisabled}>
            {this.renderPlaceholderOrValue()}
            {this.renderInput()}
          </ValueContainer>
          <IndicatorsContainer {...commonProps} isDisabled={isDisabled}>
            {this.renderClearIndicator()}
            {this.renderLoadingIndicator()}
            {this.renderIndicatorSeparator()}
            {this.renderDropdownIndicator()}
          </IndicatorsContainer>
        </Control>
        {this.renderMenu()}
        {this.renderFormField()}
      </SelectContainer>
    );
  }
}

export type PublicBaseSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = JSX.LibraryManagedAttributes<typeof Select, Props<Option, IsMulti, Group>>;
```


When performing this task, please adhere to the following instructions:
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments
## Run 1:
### Answer:
```tsx
import * as React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { defaultProps, Props, PublicBaseSelectProps } from '../index';
import { GroupBase, InputActionMeta, Options, OptionsOrGroups } from '../src/types';
import { StylesConfig } from '../src/styles';

// Mocking utils and builtins
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  isTouchCapable: () => false,
  isMobileDevice: () => false,
}));

jest.mock('../src/builtins', () => ({
  formatGroupLabel: (group: any) => group.label,
  getOptionLabel: (option: any) => option.label,
  getOptionValue: (option: any) => option.value,
  isOptionDisabled: () => false,
}));

jest.mock('../src/accessibility/helpers', () => ({
    isAppleDevice: () => false,
}));

const getTestOptions = (): Options<any> => [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const getTestGroupedOptions = (): OptionsOrGroups<any, GroupBase<any>> => [
    {
        label: 'Group 1', options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' }
        ]
    },
    {
        label: 'Group 2', options: [
            { label: 'Option 3', value: '3' },
            { label: 'Option 4', value: '4' }
        ]
    }
];

describe('Select Component', () => {
    const renderSelect = (props: Partial<Props<any, boolean, GroupBase<any>>> = {}) => {
        return render(<Select {...defaultProps} {...props} />);
    };

    it('renders without crashing', () => {
        renderSelect();
    });

    it('renders with custom className', () => {
        const {container} = renderSelect({className: 'custom-class'});
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with custom id', () => {
        const {container} = renderSelect({id: 'custom-id'});
        expect(container.firstChild).toHaveAttribute('id', 'custom-id');
    });

    it('renders with isDisabled prop', () => {
        const {container} = renderSelect({isDisabled: true});
        expect(container.querySelector('input')).toBeDisabled();
    });

    it('opens menu on input focus', async () => {
        const {getByRole} = renderSelect({openMenuOnFocus: true});
        const input = getByRole('combobox');
        await act(() => {
            input.focus();
        });

        expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('opens menu on click', async () => {
        const {getByRole} = renderSelect();
        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });
        expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('closes menu on select', async () => {
        const {getByRole, getByText} = renderSelect({options: getTestOptions()});
        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });
        const option1 = getByText('Option 1');
        await act(() => {
            userEvent.click(option1);
        });
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('calls onChange with correct value', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            onChange,
        });
        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });
        const option1 = getByText('Option 1');
        await act(() => {
            userEvent.click(option1);
        });
        expect(onChange).toHaveBeenCalledWith(
            {label: 'Option 1', value: '1'},
            {action: 'select-option', option: {label: 'Option 1', value: '1'}, name: undefined}
        );
    });

    it('calls onInputChange with correct value', async () => {
        const onInputChange = jest.fn();
        const {getByRole} = renderSelect({
            onInputChange,
        });
        const input = getByRole('combobox') as HTMLInputElement;
        await act(() => {
            userEvent.type(input, 'test');
        });

        expect(onInputChange).toHaveBeenCalledWith('test', {
            action: 'input-change',
            prevInputValue: '',
        });
    });

    it('clears value when isClearable is true', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            isClearable: true,
            value: {label: 'Option 1', value: '1'},
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        const clearIndicator = screen.getByRole('button', {name: /clear/i});
        await act(() => {
            userEvent.click(clearIndicator);
        });

        expect(onChange).toHaveBeenCalledWith(null, {action: 'clear', removedValues: [{label: 'Option 1', value: '1'}], name: undefined});
    });

    it('removes value when backspace is pressed', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            isMulti: true,
            value: [{label: 'Option 1', value: '1'}],
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{backspace}');
        });

        expect(onChange).toHaveBeenCalledWith([], {action: 'pop-value', removedValue: {label: 'Option 1', value: '1'}, name: undefined});
    });

    it('selects option on Enter key press', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{arrowdown}{enter}');
        });

        expect(onChange).toHaveBeenCalledWith(
            {label: 'Option 1', value: '1'},
            {action: 'select-option', option: {label: 'Option 1', value: '1'}, name: undefined}
        );
    });

    it('selects option on Space key press', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{arrowdown}{space}');
        });

        expect(onChange).toHaveBeenCalledWith(
            {label: 'Option 1', value: '1'},
            {action: 'select-option', option: {label: 'Option 1', value: '1'}, name: undefined}
        );
    });

    it('navigates options with arrow keys', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });
        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });
        expect(getByText('Option 2').getAttribute('aria-selected')).toBe('true');

        await act(() => {
            userEvent.type(select, '{arrowup}');
        });
        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');
    });

    it('renders grouped options', async () => {
        const {getByText} = renderSelect({
            options: getTestGroupedOptions(),
            menuIsOpen: true,
        });

        expect(getByText('Group 1')).toBeInTheDocument();
        expect(getByText('Option 1')).toBeInTheDocument();
        expect(getByText('Group 2')).toBeInTheDocument();
        expect(getByText('Option 3')).toBeInTheDocument();
    });

    it('calls onMenuClose when menu is closed', async () => {
        const onMenuClose = jest.fn();
        const {getByRole} = renderSelect({
            onMenuClose,
            menuIsOpen: true,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        expect(onMenuClose).toHaveBeenCalledTimes(1);
    });

    it('renders custom styles', () => {
        const customStyles: StylesConfig<any, boolean, GroupBase<any>> = {
            control: (base) => ({...base, backgroundColor: 'red'}),
        };
        const {container} = renderSelect({styles: customStyles});
        expect(container.querySelector('.react-select__control')).toHaveStyle(
            'background-color: red'
        );
    });

    it('renders loading indicator when isLoading is true', () => {
        const {getByText} = renderSelect({isLoading: true});
        expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('renders no options message when no options are available', () => {
        const {getByText} = renderSelect({options: [], menuIsOpen: true});
        expect(getByText('No options')).toBeInTheDocument();
    });

    it('blurs input on select when blurInputOnSelect is true', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            blurInputOnSelect: true,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        const option1 = getByText('Option 1');
        await act(() => {
            userEvent.click(option1);
        });

        expect(document.activeElement).not.toBe(select);
    });

    it('does not hide selected options when hideSelectedOptions is false', () => {
        const {getByText} = renderSelect({
            options: getTestOptions(),
            hideSelectedOptions: false,
            value: {label: 'Option 1', value: '1'},
            menuIsOpen: true,
        });

        expect(getByText('Option 1')).toBeVisible();
    });

    it('hides selected options when hideSelectedOptions is true', () => {
        const {queryByText} = renderSelect({
            options: getTestOptions(),
            hideSelectedOptions: true,
            value: {label: 'Option 1', value: '1'},
            menuIsOpen: true,
        });

        expect(queryByText('Option 1')).not.toBeVisible();
    });

    it('renders custom placeholder', () => {
        const {getByText} = renderSelect({placeholder: 'Custom Placeholder'});
        expect(getByText('Custom Placeholder')).toBeInTheDocument();
    });

    it('renders multi-value correctly', async () => {
        const {getByText, getByRole} = renderSelect({
            options: getTestOptions(),
            isMulti: true,
            value: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}],
        });

        expect(getByText('Option 1')).toBeInTheDocument();
        expect(getByText('Option 2')).toBeInTheDocument();
    });

    it('removes a specific value in multi-select', async () => {
        const onChange = jest.fn();
        const {getByText, getByRole} = renderSelect({
            options: getTestOptions(),
            isMulti: true,
            value: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}],
            onChange,
        });

        const removeButton = getByText('Option 1').parentElement!.querySelector('[role="button"]')!;
        await act(() => {
            userEvent.click(removeButton);
        });

        expect(onChange).toHaveBeenCalledWith(
            [{label: 'Option 2', value: '2'}],
            {action: 'remove-value', removedValue: {label: 'Option 1', value: '1'}, name: undefined}
        );
    });

    it('renders custom formatOptionLabel', () => {
        const formatOptionLabel = jest.fn(() => 'Formatted Label');
        const {getByText} = renderSelect({
            options: getTestOptions(),
            formatOptionLabel,
            menuIsOpen: true,
        });

        expect(getByText('Formatted Label')).toBeInTheDocument();
        expect(formatOptionLabel).toHaveBeenCalledWith(
            {label: 'Option 1', value: '1'},
            {context: 'menu', inputValue: '', selectValue: []}
        );
    });

    it('renders custom formatGroupLabel', () => {
        const formatGroupLabel = jest.fn(() => 'Formatted Group Label');
        const {getByText} = renderSelect({
            options: getTestGroupedOptions(),
            formatGroupLabel,
            menuIsOpen: true
        });
        expect(getByText('Formatted Group Label')).toBeInTheDocument();
        expect(formatGroupLabel).toHaveBeenCalled();
    });

    it('escape clears value when escapeClearsValue is true and menu is closed', async () => {
        const onChange = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            isClearable: true,
            escapeClearsValue: true,
            value: {label: 'Option 1', value: '1'},
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{esc}');
        });

        expect(onChange).not.toHaveBeenCalled();

        await act(() => {
            userEvent.type(select, '{esc}');
        });

        expect(onChange).toHaveBeenCalledWith(null, {action: 'clear', removedValues: [{label: 'Option 1', value: '1'}], name: undefined});
    });

    it('does not clear value when escapeClearsValue is false', async () => {
        const onChange = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            isClearable: true,
            escapeClearsValue: false,
            value: {label: 'Option 1', value: '1'},
            onChange,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{esc}');
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('input value updates correctly', async () => {
        const onInputChange = jest.fn();
        const {getByRole} = renderSelect({
            onInputChange,
        });

        const input = getByRole('combobox') as HTMLInputElement;
        await act(() => {
            userEvent.type(input, 'test');
        });

        expect(onInputChange).toHaveBeenCalledWith('test', {action: 'input-change', prevInputValue: ''});
    });

    it('filters options based on input value', async () => {
        const {getByRole, getByText, queryByText} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox') as HTMLInputElement;
        await act(() => {
            userEvent.click(input);
        });

        await act(() => {
            userEvent.type(input, '1');
        });

        expect(getByText('Option 1')).toBeVisible();
        expect(queryByText('Option 2')).toBeNull();
        expect(queryByText('Option 3')).toBeNull();
    });

    it('selects the correct option when isOptionSelected prop is provided', () => {
        const isOptionSelected = jest.fn((option: any, selectValue: any) => option.value === '2');
        const {getByText} = renderSelect({
            options: getTestOptions(),
            isOptionSelected,
            menuIsOpen: true,
        });

        expect(isOptionSelected).toHaveBeenCalled();
    });

    it('disables the correct option when isOptionDisabled prop is provided', () => {
        const isOptionDisabled = jest.fn((option: any) => option.value === '2');
        const {getByText} = renderSelect({
            options: getTestOptions(),
            isOptionDisabled,
            menuIsOpen: true,
        });

        expect(isOptionDisabled).toHaveBeenCalled();
    });

    it('getOptionLabel and getOptionValue are called with correct arguments', () => {
        const getOptionLabel = jest.fn((option) => option.label);
        const getOptionValue = jest.fn((option) => option.value);

        renderSelect({
            options: getTestOptions(),
            getOptionLabel,
            getOptionValue,
            menuIsOpen: true,
        });

        expect(getOptionLabel).toHaveBeenCalledWith({label: 'Option 1', value: '1'});
        expect(getOptionValue).toHaveBeenCalledWith({label: 'Option 1', value: '1'});
    });

    it('renders with custom components', () => {
        const CustomControl = () => <div data-testid="custom-control">Custom Control</div>;
        const {getByTestId} = renderSelect({
            components: {Control: CustomControl},
        });

        expect(getByTestId('custom-control')).toBeInTheDocument();
    });

    it('focuses input when autoFocus is true', () => {
        const {getByRole} = renderSelect({autoFocus: true});
        const input = getByRole('combobox');
        expect(document.activeElement).toBe(input);
    });

    it('does not focus input when autoFocus is false', () => {
        const {getByRole} = renderSelect({autoFocus: false});
        const input = getByRole('combobox');
        expect(document.activeElement).not.toBe(input);
    });

    it('calls onMenuScrollToTop when menu is scrolled to top', async () => {
        const onMenuScrollToTop = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            onMenuScrollToTop,
            menuIsOpen: true,
        });

        const menuList = getByRole('listbox');
        await act(() => {
            fireEvent.scroll(menuList, {target: {scrollTop: 0}});
        });

        expect(onMenuScrollToTop).toHaveBeenCalled();
    });

    it('calls onMenuScrollToBottom when menu is scrolled to bottom', async () => {
        const onMenuScrollToBottom = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            onMenuScrollToBottom,
            menuIsOpen: true,
        });

        const menuList = getByRole('listbox');
        // Mock scroll to bottom.
        Object.defineProperty(menuList, 'scrollHeight', {value: 400, configurable: true});
        Object.defineProperty(menuList, 'clientHeight', {value: 200, configurable: true});
        await act(() => {
            fireEvent.scroll(menuList, {target: {scrollTop: 200}});
        });

        expect(onMenuScrollToBottom).toHaveBeenCalled();
    });

    it('selects the currently focused option when tabSelectsValue is true and tab is pressed', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            onChange,
            tabSelectsValue: true,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{arrowdown}{tab}');
        });

        expect(onChange).toHaveBeenCalledWith(
            {label: 'Option 1', value: '1'},
            {action: 'select-option', option: {label: 'Option 1', value: '1'}, name: undefined}
        );
    });

    it('does not select the currently focused option when tabSelectsValue is false and tab is pressed', async () => {
        const onChange = jest.fn();
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            onChange,
            tabSelectsValue: false,
        });

        const select = getByRole('combobox');
        await act(() => {
            userEvent.click(select);
        });

        await act(() => {
            userEvent.type(select, '{arrowdown}{tab}');
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not select option on Enter if menu is not open', async () => {
        const onChange = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            onChange,
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{enter}');
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not select option on Space if menu is not open', async () => {
        const onChange = jest.fn();
        const {getByRole} = renderSelect({
            options: getTestOptions(),
            onChange,
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{space}');
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('opens menu on ArrowUp if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{arrowup}');
        });

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('opens menu on ArrowDown if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{arrowdown}');
        });

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('does nothing on PageUp if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{pageup}');
        });

        expect(screen.queryByText('Option 1')).toBeNull();
    });

    it('does nothing on PageDown if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{pagedown}');
        });

        expect(screen.queryByText('Option 1')).toBeNull();
    });

    it('does nothing on Home if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{home}');
        });

        expect(screen.queryByText('Option 1')).toBeNull();
    });

    it('does nothing on End if menu is closed', async () => {
        const {getByRole} = renderSelect({
            options: getTestOptions(),
        });

        const input = getByRole('combobox');
        await act(() => {
            userEvent.type(input, '{end}');
        });

        expect(screen.queryByText('Option 1')).toBeNull();
    });

    it('renders hidden input for form submission', () => {
        const {container} = renderSelect({
            name: 'test-input',
            value: {label: 'Option 1', value: '1'},
        });

        const hiddenInput = container.querySelector('input[type="hidden"][name="test-input"]');
        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput).toHaveValue('1');
    });

    it('renders multiple hidden inputs for multi-select form submission', () => {
        const {container} = renderSelect({
            name: 'test-input',
            isMulti: true,
            value: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}],
        });

        const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="test-input"]');
        expect(hiddenInputs.length).toBe(2);
        expect(hiddenInputs[0]).toHaveValue('1');
        expect(hiddenInputs[1]).toHaveValue('2');
    });

    it('renders required hidden input when required and no value', () => {
        const {container} = renderSelect({
            name: 'test-input',
            required: true,
        });

        const requiredInput = container.querySelector('input[type="hidden"][name="test-input"][required]');
        expect(requiredInput).toBeInTheDocument();
    });

    it('does not render required hidden input when not required', () => {
        const {container} = renderSelect({
            name: 'test-input',
            required: false,
            value: {label: 'Option 1', value: '1'},
        });

        const requiredInput = container.querySelector('input[type="hidden"][name="test-input"][required]');
        expect(requiredInput).not.toBeInTheDocument();
    });

    it('renders with custom menuPlacement', () => {
        const {container} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
            menuPlacement: 'top',
        });

        // This is a basic check. menuPlacement is handled by MenuPlacer, which is tested separately.
        expect(container.querySelector('.react-select__menu')).toBeInTheDocument();
    });

    it('renders with custom menuPosition', () => {
        const {container} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
            menuPosition: 'fixed',
        });

        // This is a basic check. menuPosition is handled by MenuPlacer, which is tested separately.
        expect(container.querySelector('.react-select__menu')).toBeInTheDocument();
    });

    it('renders with custom menuPortalTarget', () => {
        const portalTarget = document.createElement('div');
        document.body.appendChild(portalTarget);
        const {container} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
            menuPortalTarget: portalTarget,
        });

        // This is a basic check. menuPortalTarget is handled by MenuPortal, which is tested separately.
        expect(portalTarget.querySelector('.react-select__menu')).toBeInTheDocument();
        document.body.removeChild(portalTarget);
    });

    it('calls onBlur prop when input is blurred', async () => {
        const onBlur = jest.fn();
        const {getByRole} = renderSelect({onBlur});
        const input = getByRole('combobox');
        await act(() => {
            input.focus();
        });
        await act(() => {
            input.blur();
        });
        expect(onBlur).toHaveBeenCalled();
    });

    it('calls onFocus prop when input is focused', async () => {
        const onFocus = jest.fn();
        const {getByRole} = renderSelect({onFocus});
        const input = getByRole('combobox');
        await act(() => {
            input.focus();
        });
        expect(onFocus).toHaveBeenCalled();
    });

    it('focuses and blurs the input using the focus and blur methods', () => {
        const {getByRole, rerender} = renderSelect();
        const input = getByRole('combobox');
        const selectInstance = (input as any)._wrapperState?.Select;

        expect(document.activeElement).not.toBe(input);

        selectInstance.focus();
        expect(document.activeElement).toBe(input);

        selectInstance.blur();
        expect(document.activeElement).not.toBe(input);
    });

    it('updates focusedOption when navigating with arrow keys', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });
        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });
        expect(getByText('Option 2').getAttribute('aria-selected')).toBe('true');

        await act(() => {
            userEvent.type(select, '{arrowup}');
        });
        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');
    });

    it('updates focusedOption when navigating with page up and page down keys', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
            pageSize: 1,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{arrowdown}{arrowdown}{pagedown}');
        });

        expect(getByText('Option 3').getAttribute('aria-selected')).toBe('true');

        await act(() => {
            userEvent.type(select, '{pageup}');
        });

        expect(getByText('Option 2').getAttribute('aria-selected')).toBe('true');
    });

    it('focuses first option on Home key', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{arrowdown}{arrowdown}{home}');
        });

        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');
    });

    it('focuses last option on End key', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{end}');
        });

        expect(getByText('Option 3').getAttribute('aria-selected')).toBe('true');
    });

    it('does not update focusedOption when blockOptionHover is true', async () => {
        const {getByRole, getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const select = getByRole('combobox');

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });

        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');

        const selectInstance = (select as any)._wrapperState?.Select;
        selectInstance.blockOptionHover = true;

        await act(() => {
            userEvent.type(select, '{arrowdown}');
        });

        expect(getByText('Option 1').getAttribute('aria-selected')).toBe('true');
    });

    it('onOptionHover is called when mouse moves over an option', async () => {
        const {getByText} = renderSelect({
            options: getTestOptions(),
            menuIsOpen: true,
        });

        const option2 = getByText('Option 2');
        await act(() => {
            fireEvent.mouseMove(option2);
            fireEvent.mouseOver(option2);
        });

        expect(option2.getAttribute('aria-selected')).toBe('true');
    });

    it('renders screenReaderStatus prop', () => {
        const screenReaderStatus = jest.fn(({count}) => `${count} results`);
        const {getByText} = renderSelect({
            options: getTestOptions(),
            screenReaderStatus,
            menuIsOpen: true,
        });

        expect(getByText('3 results')).toBeInTheDocument();
        expect(screenReaderStatus).toHaveBeenCalledWith({count: 3});
    });
})
```
### Tokens: {'input_tokens': 18138, 'output_tokens': 8192}
### Execution time: 73.49283003807068
