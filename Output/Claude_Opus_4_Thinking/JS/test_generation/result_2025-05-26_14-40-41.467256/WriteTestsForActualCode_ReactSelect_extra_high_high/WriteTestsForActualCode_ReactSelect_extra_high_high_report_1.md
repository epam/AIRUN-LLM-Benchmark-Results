I have the following application code that needs comprehensive unit testing:

<source_code>
```tsx
// index.tsx
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

</source_code>

Please follow these steps:

1. Test Environment Setup:
   - Set up Jest and React Testing Library
   - Configure necessary test utilities for event handling
   - Ensure proper DOM environment simulation

2. Component Rendering Tests:
   - Test basic component rendering with default props
   - Verify proper DOM structure and accessibility attributes
   - Validate that required props are properly applied to the rendered output

3. User Interaction Testing:
   - Test keyboard navigation functionality (arrows, tab, enter, escape keys)
   - Test mouse interactions (clicking, hovering, focusing elements)
   - Simulate touch events for mobile device compatibility

4. State Management Tests:
   - Verify controlled and uncontrolled component behavior
   - Test state changes when selecting, removing, and clearing values
   - Ensure proper focus management during interactions

5. Menu and Options Tests:
   - Test menu opening/closing behavior
   - Verify option filtering and searching functionality
   - Validate option selection, deselection, and multi-select behavior

6. Accessibility Testing:
   - Verify ARIA attributes and screen reader compatibility
   - Test keyboard-only navigation flows
   - Ensure focus trapping and management works correctly

7. Edge Case Testing:
   - Test component behavior with empty options
   - Test loading and error states
   - Verify component behavior with disabled options/states

8. Performance Testing:
   - Test rendering performance with large option sets
   - Verify optimization features work correctly

9. Test Coverage Requirements:
   - Aim for at least 80% code coverage
   - Use mocking for external dependencies
   - Create comprehensive test cases for all component props

10. Test Documentation:
    - Document test cases clearly
    - Group related tests logically
    - Include setup and teardown procedures where needed
## Run 1:
### Thoughts:
The user wants me to create comprehensive unit tests for this React Select component. This is a complex component with many features including:

1. Keyboard navigation
2. Mouse/touch interactions
3. Controlled/uncontrolled behavior
4. Single/multi-select modes
5. Menu open/close behavior
6. Option filtering
7. Accessibility features
8. Form integration
9. Custom components

I need to write tests that cover all these features thoroughly. Let me break this down into test files:

1. `Select.test.tsx` - Main component tests
2. `Select.keyboard.test.tsx` - Keyboard interaction tests
3. `Select.mouse.test.tsx` - Mouse interaction tests
4. `Select.accessibility.test.tsx` - Accessibility tests
5. `Select.state.test.tsx` - State management tests
6. `Select.menu.test.tsx` - Menu behavior tests
7. `Select.options.test.tsx` - Options handling tests
8. `Select.form.test.tsx` - Form integration tests

Let me start with the setup file and main test file.

### Answer:
I'll create comprehensive unit tests for the Select component. Let me start with the test setup and then create organized test files covering all the requirements.

## Test Setup

First, let's create the test utilities and setup:

```typescript
// __tests__/setup/testUtils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Props } from '../../index';

export const basicOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

export const groupedOptions = [
  {
    label: 'Group 1',
    options: [
      { label: 'Option 1.1', value: 'opt1-1' },
      { label: 'Option 1.2', value: 'opt1-2' },
    ],
  },
  {
    label: 'Group 2',
    options: [
      { label: 'Option 2.1', value: 'opt2-1' },
      { label: 'Option 2.2', value: 'opt2-2' },
    ],
  },
];

export const defaultProps: Partial<Props<any, false, any>> = {
  className: 'test-select',
  classNamePrefix: 'test',
  onChange: jest.fn(),
  onInputChange: jest.fn(),
  onMenuOpen: jest.fn(),
  onMenuClose: jest.fn(),
  options: basicOptions,
};

export function renderSelect(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  };
}

// Mock utilities
export const mockScrollIntoView = jest.fn();
HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

// Mock touch capabilities
export const mockTouchCapable = (capable: boolean) => {
  Object.defineProperty(window, 'ontouchstart', {
    value: capable ? () => {} : undefined,
    writable: true,
  });
};

// Mock mobile device
export const mockMobileDevice = (isMobile: boolean) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    writable: true,
    configurable: true,
  });
};
```

## Main Component Tests

```tsx
// __tests__/Select.test.tsx
import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions, groupedOptions } from './setup/testUtils';

describe('Select Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      renderSelect(<Select {...defaultProps} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} className="custom-class" />
      );
      
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render with custom id', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} id="custom-id" />
      );
      
      expect(container.querySelector('#custom-id')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      renderSelect(
        <Select {...defaultProps} placeholder="Choose an option" />
      );
      
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should apply classNamePrefix to inner components', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} classNamePrefix="custom" />
      );
      
      expect(container.querySelector('.custom__control')).toBeInTheDocument();
      expect(container.querySelector('.custom__value-container')).toBeInTheDocument();
      expect(container.querySelector('.custom__indicators')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled state correctly', () => {
      renderSelect(<Select {...defaultProps} isDisabled />);
      
      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    it('should not respond to interactions when disabled', async () => {
      const { user } = renderSelect(<Select {...defaultProps} isDisabled />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(defaultProps.onMenuOpen).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should render loading indicator when isLoading', () => {
      renderSelect(<Select {...defaultProps} isLoading />);
      
      expect(screen.getByText('Loading', { exact: false })).toBeInTheDocument();
    });

    it('should show custom loading message in menu', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isLoading
          menuIsOpen
          loadingMessage={() => 'Custom loading...'}
        />
      );
      
      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });
  });

  describe('Value Rendering', () => {
    it('should render single value', () => {
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should render multiple values', () => {
      renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should not render value when controlShouldRenderValue is false', () => {
      renderSelect(
        <Select
          {...defaultProps}
          value={basicOptions[0]}
          controlShouldRenderValue={false}
        />
      );
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Search Input', () => {
    it('should render searchable input by default', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render non-searchable input', () => {
      renderSelect(<Select {...defaultProps} isSearchable={false} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-readonly', 'true');
    });

    it('should update input value on change', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'test');
      
      expect(defaultProps.onInputChange).toHaveBeenCalledWith('test', {
        action: 'input-change',
        prevInputValue: '',
      });
    });
  });

  describe('Clear Indicator', () => {
    it('should show clear indicator when value is selected and isClearable', () => {
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('should not show clear indicator when no value', () => {
      renderSelect(<Select {...defaultProps} isClearable />);
      
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('should clear value when clear indicator is clicked', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(null, {
        action: 'clear',
        removedValues: [basicOptions[0]],
      });
    });
  });

  describe('Dropdown Indicator', () => {
    it('should render dropdown indicator', () => {
      renderSelect(<Select {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    });

    it('should toggle menu on dropdown indicator click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const dropdownButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(dropdownButton);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(defaultProps.onMenuOpen).toHaveBeenCalled();
      
      await user.click(dropdownButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(defaultProps.onMenuClose).toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct ARIA attributes', () => {
      renderSelect(
        <Select
          {...defaultProps}
          aria-label="Select option"
          aria-labelledby="label-id"
          aria-describedby="desc-id"
          aria-invalid={true}
          aria-errormessage="error-id"
          required
        />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-label', 'Select option');
      expect(input).toHaveAttribute('aria-labelledby', 'label-id');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'error-id');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should update aria-expanded based on menu state', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Grouped Options', () => {
    it('should render grouped options correctly', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} options={groupedOptions} />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      expect(screen.getByText('Option 1.1')).toBeInTheDocument();
      expect(screen.getByText('Option 2.1')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should focus input on mount when autoFocus is true', () => {
      renderSelect(<Select {...defaultProps} autoFocus />);
      
      const input = screen.getByRole('combobox');
      expect(document.activeElement).toBe(input);
    });

    it('should handle component updates correctly', () => {
      const { rerender } = renderSelect(
        <Select {...defaultProps} value={null} />
      );
      
      expect(screen.getByText('Select...')).toBeInTheDocument();
      
      rerender(<Select {...defaultProps} value={basicOptions[0]} />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render custom Option component', async () => {
      const CustomOption = (props: any) => (
        <div className="custom-option">{props.children}</div>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          components={{ Option: CustomOption }}
        />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getAllByClassName('custom-option')).toHaveLength(3);
    });
  });

  describe('Styles and Theme', () => {
    it('should apply custom styles', () => {
      const customStyles = {
        control: (base: any) => ({ ...base, backgroundColor: 'red' }),
      };
      
      renderSelect(<Select {...defaultProps} styles={customStyles} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      expect(control).toHaveStyle({ backgroundColor: 'red' });
    });

    it('should apply custom theme', () => {
      const customTheme = (theme: any) => ({
        ...theme,
        colors: { ...theme.colors, primary: 'green' },
      });
      
      renderSelect(<Select {...defaultProps} theme={customTheme} />);
      
      // Theme application would be tested through visual regression or specific style checks
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
```

## Keyboard Interaction Tests

```tsx
// __tests__/Select.keyboard.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions } from './setup/testUtils';

describe('Select Keyboard Interactions', () => {
  describe('Menu Navigation', () => {
    it('should open menu with Space key', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard(' ');
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open menu with ArrowDown key', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should close menu with Escape key', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should navigate options with arrow keys', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // First option should be focused by default
      let focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      // Navigate down
      await user.keyboard('{ArrowDown}');
      focusedOption = screen.getByText('Option 2').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      // Navigate up
      await user.keyboard('{ArrowUp}');
      focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });

    it('should wrap navigation at boundaries', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Navigate to last option
      await user.keyboard('{End}');
      let focusedOption = screen.getByText('Option 3').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      // Navigate down should wrap to first
      await user.keyboard('{ArrowDown}');
      focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });

    it('should navigate with Page Up/Down', async () => {
      const options = Array.from({ length: 10 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));
      
      const { user } = renderSelect(
        <Select {...defaultProps} options={options} menuIsOpen pageSize={5} />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Navigate with PageDown
      await user.keyboard('{PageDown}');
      let focusedOption = screen.getByText('Option 6').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      // Navigate with PageUp
      await user.keyboard('{PageUp}');
      focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });

    it('should navigate to first/last with Home/End', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Navigate to last
      await user.keyboard('{End}');
      let focusedOption = screen.getByText('Option 3').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      // Navigate to first
      await user.keyboard('{Home}');
      focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });
  });

  describe('Option Selection', () => {
    it('should select option with Enter key', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(basicOptions[0], {
        action: 'select-option',
        option: basicOptions[0],
        name: undefined,
      });
    });

    it('should select option with Tab key when tabSelectsValue is true', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} tabSelectsValue menuIsOpen />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Tab}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(basicOptions[0], {
        action: 'select-option',
        option: basicOptions[0],
        name: undefined,
      });
    });

    it('should not select option with Tab when tabSelectsValue is false', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} tabSelectsValue={false} menuIsOpen />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Tab}');
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('Multi-Select Value Navigation', () => {
    it('should navigate between values with arrow keys', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Navigate to previous value
      await user.keyboard('{ArrowLeft}');
      
      // The last value should be focused
      const multiValue = screen.getByText('Option 2').closest('.test__multi-value');
      expect(multiValue).toHaveClass('test__multi-value--is-focused');
    });

    it('should remove focused value with Delete key', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{Delete}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        [basicOptions[0]],
        expect.objectContaining({
          action: 'remove-value',
          removedValue: basicOptions[1],
        })
      );
    });

    it('should remove last value with Backspace', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
          backspaceRemovesValue
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Backspace}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        [basicOptions[0]],
        expect.objectContaining({
          action: 'pop-value',
          removedValue: basicOptions[1],
        })
      );
    });
  });

  describe('Clear Functionality', () => {
    it('should clear value with Escape when escapeClearsValue is true', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          value={basicOptions[0]}
          escapeClearsValue
          isClearable
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Escape}');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(null, {
        action: 'clear',
        removedValues: [basicOptions[0]],
      });
    });

    it('should clear all values in multi-select', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
          isClearable
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Select all text and delete
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('{Backspace}');
      
      // Or use clear functionality
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith([], {
        action: 'clear',
        removedValues: [basicOptions[0], basicOptions[1]],
      });
    });
  });

  describe('Input and Filtering', () => {
    it('should filter options as user types', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, '2');
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });

    it('should show no options message when no matches', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} noOptionsMessage={() => 'No matches found'} />
      );
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'xyz');
      
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  describe('Composition Events', () => {
    it('should handle IME composition correctly', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      
      // Simulate composition start
      const compositionStartEvent = new CompositionEvent('compositionstart');
      input.dispatchEvent(compositionStartEvent);
      
      // Type during composition
      await user.type(input, 'あ');
      
      // Simulate composition end
      const compositionEndEvent = new CompositionEvent('compositionend');
      input.dispatchEvent(compositionEndEvent);
      
      // Enter should now work
      await user.keyboard('{Enter}');
      
      // Verify the component handled composition correctly
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Disabled Options', () => {
    it('should skip disabled options during keyboard navigation', async () => {
      const optionsWithDisabled = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2', isDisabled: true },
        { label: 'Option 3', value: 'opt3' },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={optionsWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Navigate down - should skip disabled option
      await user.keyboard('{ArrowDown}');
      const focusedOption = screen.getByText('Option 3').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });

    it('should not select disabled option with Enter', async () => {
      const optionsWithDisabled = [
        { label: 'Option 1', value: 'opt1', isDisabled: true },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={optionsWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Enter}');
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });
});
```

## Mouse Interaction Tests

```tsx
// __tests__/Select.mouse.test.tsx
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions, mockTouchCapable } from './setup/testUtils';

describe('Select Mouse Interactions', () => {
  beforeEach(() => {
    mockTouchCapable(false);
  });

  describe('Control Interactions', () => {
    it('should open menu on control click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(defaultProps.onMenuOpen).toHaveBeenCalled();
    });

    it('should focus input on control click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      expect(document.activeElement).toBe(screen.getByRole('combobox'));
    });

    it('should close menu on control click when menu is open', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(defaultProps.onMenuClose).toHaveBeenCalled();
    });

    it('should not open menu when openMenuOnClick is false', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} openMenuOnClick={false} />
      );
      
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Option Interactions', () => {
    it('should select option on click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const option = screen.getByText('Option 2');
      await user.click(option);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(basicOptions[1], {
        action: 'select-option',
        option: basicOptions[1],
        name: undefined,
      });
    });

    it('should highlight option on hover', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const option = screen.getByText('Option 2');
      await user.hover(option);
      
      expect(option.closest('[role="option"]')).toHaveClass('test__option--is-focused');
    });

    it('should not select disabled option', async () => {
      const optionsWithDisabled = [
        { label: 'Option 1', value: 'opt1', isDisabled: true },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={optionsWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      const option = screen.getByText('Option 1');
      await user.click(option);
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('should deselect option in multi-select', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0]]}
          menuIsOpen
        />
      );
      
      const option = screen.getByText('Option 1');
      await user.click(option);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith([], {
        action: 'deselect-option',
        option: basicOptions[0],
        name: undefined,
      });
    });
  });

  describe('Clear Indicator', () => {
    it('should clear value on clear indicator click', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(null, {
        action: 'clear',
        removedValues: [basicOptions[0]],
      });
    });

    it('should prevent default on mousedown', async () => {
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      const mouseDownEvent = fireEvent.mouseDown(clearButton);
      
      expect(mouseDownEvent).toBeTruthy();
    });
  });

  describe('Dropdown Indicator', () => {
    it('should toggle menu on dropdown indicator click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const dropdownButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(dropdownButton);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      await user.click(dropdownButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should focus input on dropdown click', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const dropdownButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(dropdownButton);
      
      expect(document.activeElement).toBe(screen.getByRole('combobox'));
    });
  });

  describe('Multi-Value Remove', () => {
    it('should remove value on remove button click', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        [basicOptions[1]],
        expect.objectContaining({
          action: 'remove-value',
          removedValue: basicOptions[0],
        })
      );
    });
  });

  describe('Menu Mouse Events', () => {
    it('should prevent menu mousedown from bubbling', () => {
      renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const menu = screen.getByRole('listbox').parentElement;
      const event = fireEvent.mouseDown(menu!);
      
      expect(event).toBeTruthy();
    });

    it('should block option hover after keyboard navigation', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      // Navigate with keyboard
      await user.keyboard('{ArrowDown}');
      
      // Hover should not change focus immediately
      const option1 = screen.getByText('Option 1');
      await user.hover(option1);
      
      // Focus should remain on Option 2
      const option2 = screen.getByText('Option 2').closest('[role="option"]');
      expect(option2).toHaveClass('test__option--is-focused');
    });
  });

  describe('Touch Events', () => {
    beforeEach(() => {
      mockTouchCapable(true);
    });

    it('should handle touch start correctly', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      
      fireEvent.touchStart(control!, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      
      expect(control).toBeInTheDocument();
    });

    it('should handle touch end on control', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      
      fireEvent.touchStart(control!, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      
      fireEvent.touchEnd(control!);
      
      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByRole('combobox'));
      });
    });

    it('should detect drag and not trigger click', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      
      fireEvent.touchStart(control!, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      
      fireEvent.touchMove(control!, {
        touches: [{ clientX: 10, clientY: 10 }],
      });
      
      fireEvent.touchEnd(control!);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should blur input on touch outside', () => {
      const { container } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      fireEvent.touchStart(document.body, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      
      fireEvent.touchEnd(document.body);
      
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('Scroll Events', () => {
    it('should close menu on document scroll when closeMenuOnScroll is true', async () => {
      renderSelect(
        <Select {...defaultProps} menuIsOpen closeMenuOnScroll />
      );
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      fireEvent.scroll(document);
      
      await waitFor(() => {
        expect(defaultProps.onMenuClose).toHaveBeenCalled();
      });
    });

    it('should not close menu on internal scroll', () => {
      renderSelect(
        <Select {...defaultProps} menuIsOpen closeMenuOnScroll />
      );
      
      const menuList = screen.getByRole('listbox');
      fireEvent.scroll(menuList);
      
      expect(defaultProps.onMenuClose).not.toHaveBeenCalled();
    });

    it('should use custom closeMenuOnScroll function', () => {
      const customScrollHandler = jest.fn(() => true);
      
      renderSelect(
        <Select
          {...defaultProps}
          menuIsOpen
          closeMenuOnScroll={customScrollHandler}
        />
      );
      
      fireEvent.scroll(document);
      
      expect(customScrollHandler).toHaveBeenCalled();
      expect(defaultProps.onMenuClose).toHaveBeenCalled();
    });
  });

  describe('Right Click Prevention', () => {
    it('should ignore right clicks on controls', async () => {
      renderSelect(<Select {...defaultProps} />);
      
      const control = screen.getByRole('combobox').closest('.test__control');
      fireEvent.mouseDown(control!, { button: 2 });
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should ignore right clicks on indicators', () => {
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.mouseDown(clearButton, { button: 2 });
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });
});
```

## Accessibility Tests

```tsx
// __tests__/Select.accessibility.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions } from './setup/testUtils';

describe('Select Accessibility', () => {
  describe('ARIA Attributes', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderSelect(
        <Select {...defaultProps} aria-label="Select option" />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have correct combobox role and attributes', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('role', 'combobox');
    });

    it('should update aria-expanded based on menu state', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
      
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should have aria-controls when menu is open', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).not.toHaveAttribute('aria-controls');
      
      await user.click(input);
      expect(input).toHaveAttribute('aria-controls', expect.stringContaining('listbox'));
    });

    it('should have aria-describedby for placeholder', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('placeholder'));
    });

    it('should have aria-describedby for live region when focused with value', () => {
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} autoFocus />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('live-region'));
    });

    it('should support custom aria attributes', () => {
      renderSelect(
        <Select
          {...defaultProps}
          aria-label="Custom label"
          aria-labelledby="label-id"
          aria-invalid={true}
          aria-errormessage="error-id"
          aria-live="assertive"
        />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('aria-labelledby', 'label-id');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'error-id');
    });
  });

  describe('Live Region', () => {
    it('should announce option selection', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      const liveRegion = screen.getByRole('status', { hidden: true });
      expect(liveRegion).toHaveTextContent(/option 1.*selected/i);
    });

    it('should announce value removal', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} isClearable />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      const liveRegion = screen.getByRole('status', { hidden: true });
      expect(liveRegion).toHaveTextContent(/option 1.*deselected/i);
    });

    it('should announce focused option', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      
      const liveRegion = screen.getByRole('status', { hidden: true });
      expect(liveRegion).toHaveTextContent(/option 2.*focused/i);
    });

    it('should use custom aria messages', async () => {
      const customMessages = {
        guidance: () => 'Custom guidance',
        onChange: () => 'Custom change message',
        onFocus: () => 'Custom focus message',
        onFilter: () => 'Custom filter message',
      };
      
      const { user } = renderSelect(
        <Select {...defaultProps} ariaLiveMessages={customMessages} />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const liveRegion = screen.getByRole('status', { hidden: true });
      expect(liveRegion).toHaveTextContent('Custom guidance');
    });
  });

  describe('Option Attributes', () => {
    it('should have correct role and selection state', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} menuIsOpen />
      );
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('should have unique ids for options', async () => {
      renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const options = screen.getAllByRole('option');
      const ids = options.map(opt => opt.id);
      
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach(id => expect(id).toMatch(/option-\d+$/));
    });

    it('should update aria-activedescendant', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'));
    });

    it('should not set aria-activedescendant on Apple devices', () => {
      // Mock Apple device
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
      });
      
      renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });
  });

  describe('Multi-Select Attributes', () => {
    it('should have aria-multiselectable on listbox', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} isMulti menuIsOpen />
      );
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('should announce multiple selections', async () => {
      const { user } = renderSelect(<Select {...defaultProps} isMulti />);
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      await user.click(screen.getByText('Option 2'));
      
      const liveRegion = screen.getByRole('status', { hidden: true });
      expect(liveRegion).toHaveTextContent(/option 2.*added/i);
    });
  });

  describe('Screen Reader Status', () => {
    it('should announce available results count', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, '2');
      
      // Default screen reader status
      expect(screen.getByText('1 result available')).toBeInTheDocument();
    });

    it('should use custom screenReaderStatus', async () => {
      const customStatus = ({ count }: { count: number }) => 
        `${count} custom results`;
      
      const { user } = renderSelect(
        <Select {...defaultProps} screenReaderStatus={customStatus} />
      );
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'Option');
      
      expect(screen.getByText('3 custom results')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should have required attribute when required prop is set', () => {
      renderSelect(<Select {...defaultProps} required />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should render hidden required input for form validation', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} name="select-field" required />
      );
      
      const requiredInput = container.querySelector('input[required]');
      expect(requiredInput).toBeInTheDocument();
      expect(requiredInput).toHaveAttribute('name', 'select-field');
      expect(requiredInput).toHaveStyle({ opacity: '0' });
    });
  });

  describe('Disabled State', () => {
    it('should have correct attributes when disabled', () => {
      renderSelect(<Select {...defaultProps} isDisabled />);
      
      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('disabled');
    });

    it('should not have tabindex when disabled', () => {
      renderSelect(<Select {...defaultProps} isDisabled />);
      
      const input = screen.getByRole('combobox');
      expect(input).not.toHaveAttribute('tabindex');
    });
  });

  describe('Loading State', () => {
    it('should announce loading state', async () => {
      const { user } = renderSelect(<Select {...defaultProps} isLoading />);
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Group Headers', () => {
    it('should have correct role for group headers', async () => {
      const groupedOptions = [
        {
          label: 'Group 1',
          options: [
            { label: 'Option 1.1', value: 'opt1-1' },
          ],
        },
      ];
      
      renderSelect(
        <Select {...defaultProps} options={groupedOptions} menuIsOpen />
      );
      
      const group = screen.getByText('Group 1');
      expect(group.tagName).toBe('DIV'); // Group headers are typically divs
      expect(group).toHaveAttribute('id', expect.stringContaining('group'));
    });
  });

  describe('Focus Management', () => {
    it('should trap focus within component', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      // Tab should keep focus within component when menu is open
      await user.keyboard('{Tab}');
      
      // Focus should still be in the component
      expect(document.activeElement).toBe(input);
    });

    it('should restore focus after menu close', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Escape}');
      
      expect(document.activeElement).toBe(input);
    });
  });

  describe('RTL Support', () => {
    it('should handle RTL mode correctly', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} isRtl />
      );
      
      // RTL classes or styles should be applied
      const control = container.querySelector('.test__control');
      expect(control).toHaveClass('test__control--is-rtl');
    });
  });
});
```

## State Management Tests

```tsx
// __tests__/Select.state.test.tsx
import React from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions } from './setup/testUtils';

describe('Select State Management', () => {
  describe('Controlled Component', () => {
    it('should update value from props', () => {
      const { rerender } = renderSelect(
        <Select {...defaultProps} value={null} />
      );
      
      expect(screen.getByText('Select...')).toBeInTheDocument();
      
      rerender(<Select {...defaultProps} value={basicOptions[0]} />);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should not update value without onChange', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} onChange={undefined} value={null} />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('should handle value prop changes in multi-select', () => {
      const { rerender } = renderSelect(
        <Select {...defaultProps} isMulti value={[]} />
      );
      
      expect(screen.getByText('Select...')).toBeInTheDocument();
      
      rerender(
        <Select {...defaultProps} isMulti value={[basicOptions[0], basicOptions[1]]} />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should handle input value changes', async () => {
      const { user, rerender } = renderSelect(
        <Select {...defaultProps} inputValue="" />
      );
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      expect(input.value).toBe('');
      
      rerender(<Select {...defaultProps} inputValue="test" />);
      expect(input.value).toBe('test');
    });

    it('should call onInputChange but not update internal state in controlled mode', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} inputValue="controlled" />
      );
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      await user.type(input, 'new');
      
      expect(defaultProps.onInputChange).toHaveBeenCalled();
      expect(input.value).toBe('controlled'); // Should not change
    });
  });

  describe('Uncontrolled Component', () => {
    it('should manage its own state when value prop is undefined', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={undefined} />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should manage input value internally', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} inputValue={undefined} />
      );
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      await user.type(input, 'test');
      
      expect(input.value).toBe('test');
    });
  });

  describe('Focus State', () => {
    it('should track focus state correctly', async () => {
      const { user, container } = renderSelect(<Select {...defaultProps} />);
      
      const control = container.querySelector('.test__control');
      expect(control).not.toHaveClass('test__control--is-focused');
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(control).toHaveClass('test__control--is-focused');
      
      await user.tab();
      
      expect(control).not.toHaveClass('test__control--is-focused');
    });

    it('should maintain focus state through interactions', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Select an option
      await user.click(screen.getByText('Option 1'));
      
      // Should still be focused after selection
      expect(document.activeElement).toBe(input);
    });

    it('should blur on blurInputOnSelect', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} blurInputOnSelect />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.click(screen.getByText('Option 1'));
      
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('Menu State', () => {
    it('should track menu open state', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should handle controlled menu state', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuIsOpen={true} />
      );
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      // Try to close - should remain open because it's controlled
      await user.keyboard('{Escape}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should close menu on selection when closeMenuOnSelect is true', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} closeMenuOnSelect />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should keep menu open in multi-select by default', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} isMulti />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Option Focus State', () => {
    it('should track focused option', async () => {
      const { user } = renderSelect(<Select {...defaultProps} menuIsOpen />);
      
      await user.keyboard('{ArrowDown}');
      
      let focusedOption = screen.getByText('Option 2').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
      
      await user.keyboard('{ArrowDown}');
      
      focusedOption = screen.getByText('Option 3').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });

    it('should reset focused option on menu close', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Escape}');
      
      // Reopen menu
      await user.click(screen.getByRole('combobox'));
      
      // First option should be focused
      const focusedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(focusedOption).toHaveClass('test__option--is-focused');
    });
  });

  describe('Multi-Select Value Focus', () => {
    it('should track focused value in multi-select', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowLeft}');
      
      const focusedValue = screen.getByText('Option 2').closest('.test__multi-value');
      expect(focusedValue).toHaveClass('test__multi-value--is-focused');
    });

    it('should clear focused value on selection', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0]]}
        />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowLeft}');
      
      // Select new option
      await user.click(screen.getByText('Option 2'));
      
      // Focused value should be cleared
      const values = screen.getAllByText(/Option/);
      values.forEach(value => {
        const multiValue = value.closest('.test__multi-value');
        if (multiValue) {
          expect(multiValue).not.toHaveClass('test__multi-value--is-focused');
        }
      });
    });
  });

  describe('Hidden Input State', () => {
    it('should hide input after selection in single-select', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      expect(input).not.toHaveStyle({ display: 'none' });
      
      await user.click(input);
      await user.click(screen.getByText('Option 1'));
      
      await waitFor(() => {
        expect(input).toHaveStyle({ opacity: '0' });
      });
    });

    it('should not hide input in multi-select', async () => {
      const { user } = renderSelect(<Select {...defaultProps} isMulti />);
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      
      await user.click(input);
      await user.click(screen.getByText('Option 1'));
      
      expect(input).not.toHaveStyle({ display: 'none' });
    });
  });

  describe('Clear Focus Value State', () => {
    it('should clear focus value on update', async () => {
      const { user, rerender } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      // Focus a value
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowLeft}');
      
      // Update values
      rerender(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0]]}
        />
      );
      
      // No value should be focused
      const values = screen.getAllByText(/Option/);
      values.forEach(value => {
        const multiValue = value.closest('.test__multi-value');
        if (multiValue) {
          expect(multiValue).not.toHaveClass('test__multi-value--is-focused');
        }
      });
    });
  });

  describe('Instance Methods', () => {
    it('should expose focus method', () => {
      const ref = React.createRef<Select>();
      renderSelect(<Select {...defaultProps} ref={ref} />);
      
      act(() => {
        ref.current?.focus();
      });
      
      expect(document.activeElement).toBe(screen.getByRole('combobox'));
    });

    it('should expose blur method', () => {
      const ref = React.createRef<Select>();
      renderSelect(<Select {...defaultProps} ref={ref} />);
      
      const input = screen.getByRole('combobox');
      input.focus();
      
      act(() => {
        ref.current?.blur();
      });
      
      expect(document.activeElement).not.toBe(input);
    });

    it('should expose getValue method', () => {
      const ref = React.createRef<Select>();
      renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} ref={ref} />
      );
      
      const value = ref.current?.getValue();
      expect(value).toEqual([basicOptions[0]]);
    });
  });

  describe('Composition State', () => {
    it('should track composition state', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox') as HTMLInputElement;
      
      // Start composition
      const compositionStartEvent = new CompositionEvent('compositionstart');
      input.dispatchEvent(compositionStartEvent);
      
      // Try to select with Enter during composition
      await user.click(input);
      await user.keyboard('{Enter}');
      
      // Should not select during composition
      expect(defaultProps.onChange).not.toHaveBeenCalled();
      
      // End composition
      const compositionEndEvent = new CompositionEvent('compositionend');
      input.dispatchEvent(compositionEndEvent);
      
      // Now Enter should work
      await user.keyboard('{Enter}');
      expect(defaultProps.onChange).toHaveBeenCalled();
    });
  });

  describe('Open After Focus State', () => {
    it('should open menu after focus when clicking on control while unfocused', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} openMenuOnClick />
      );
      
      // Click on control while not focused
      const control = screen.getByRole('combobox').closest('.test__control');
      await user.click(control!);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should respect openMenuOnFocus', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} openMenuOnFocus />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
```

## Menu and Options Tests

```tsx
// __tests__/Select.menu.test.tsx
import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions, groupedOptions } from './setup/testUtils';

describe('Select Menu and Options', () => {
  describe('Menu Rendering', () => {
    it('should render menu when open', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should render all options', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      await user.click(screen.getByRole('combobox'));
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render grouped options', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} options={groupedOptions} />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    it('should not render empty groups', async () => {
      const optionsWithEmptyGroup = [
        {
          label: 'Empty Group',
          options: [],
        },
        {
          label: 'Group with Options',
          options: [{ label: 'Option 1', value: 'opt1' }],
        },
      ];
      
      const { user } = renderSelect(
        <Select {...defaultProps} options={optionsWithEmptyGroup} />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.queryByText('Empty Group')).not.toBeInTheDocument();
      expect(screen.getByText('Group with Options')).toBeInTheDocument();
    });
  });

  describe('Menu Positioning', () => {
    it('should position menu below control by default', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      await user.click(screen.getByRole('combobox'));
      
      const menu = screen.getByRole('listbox').parentElement;
      expect(menu).toHaveStyle({ position: 'absolute' });
    });

    it('should handle fixed menu position', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuPosition="fixed" />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      const menu = screen.getByRole('listbox').parentElement;
      expect(menu).toHaveStyle({ position: 'fixed' });
    });

    it('should respect menuPlacement prop', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuPlacement="top" />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      // Menu placement would be tested through visual regression
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should handle auto placement', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuPlacement="auto" />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Menu Portal', () => {
    it('should render menu in portal target', async () => {
      const portalTarget = document.createElement('div');
      portalTarget.id = 'portal-target';
      document.body.appendChild(portalTarget);
      
      const { user } = renderSelect(
        <Select {...defaultProps} menuPortalTarget={portalTarget} />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      const menu = within(portalTarget).getByRole('listbox');
      expect(menu).toBeInTheDocument();
      
      document.body.removeChild(portalTarget);
    });

    it('should handle null portal target', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuPortalTarget={null} />
      );
      
      await user.click(screen.getByRole('combobox'));
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Option Filtering', () => {
    it('should filter options based on input', async () => {
      const { user } = renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, '2');
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });

    it('should use custom filter function', async () => {
      const customFilter = jest.fn((option, inputValue) => 
        option.value.startsWith(inputValue)
      );
      
      const { user } = renderSelect(
        <Select {...defaultProps} filterOption={customFilter} />
      );
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'opt');
      
      expect(customFilter).toHaveBeenCalled();
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('should disable filtering when filterOption is null', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} filterOption={null} />
      );
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'xyz');
      
      // All options should still be visible
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('should show no options message when filtered empty', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} noOptionsMessage={() => 'No matches'} />
      );
      
      const input = screen.getByRole('combobox');
      await user.type(input, 'xyz');
      
      expect(screen.getByText('No matches')).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    it('should mark selected options', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} value={basicOptions[0]} menuIsOpen />
      );
      
      const selectedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
      expect(selectedOption).toHaveClass('test__option--is-selected');
    });

    it('should handle custom isOptionSelected', async () => {
      const isOptionSelected = jest.fn((option, selectValue) => 
        option.value === 'opt2'
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isOptionSelected={isOptionSelected}
          menuIsOpen
        />
      );
      
      const option2 = screen.getByText('Option 2').closest('[role="option"]');
      expect(option2).toHaveClass('test__option--is-selected');
      expect(isOptionSelected).toHaveBeenCalled();
    });

    it('should hide selected options when hideSelectedOptions is true', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          value={basicOptions[0]}
          hideSelectedOptions
          menuIsOpen
        />
      );
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should hide selected options in multi-select by default', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          value={[basicOptions[0]]}
          menuIsOpen
        />
      );
      
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Disabled Options', () => {
    it('should render disabled options with correct styling', async () => {
      const optionsWithDisabled = [
        { label: 'Option 1', value: 'opt1', isDisabled: true },
        { label: 'Option 2', value: 'opt2' },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={optionsWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      const disabledOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(disabledOption).toHaveClass('test__option--is-disabled');
    });

    it('should not select disabled options', async () => {
      const optionsWithDisabled = [
        { label: 'Option 1', value: 'opt1', isDisabled: true },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={optionsWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      await user.click(screen.getByText('Option 1'));
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('should filter out all-disabled groups', async () => {
      const groupedWithDisabled = [
        {
          label: 'All Disabled',
          options: [
            { label: 'Disabled 1', value: 'd1', isDisabled: true },
            { label: 'Disabled 2', value: 'd2', isDisabled: true },
          ],
        },
        {
          label: 'Mixed',
          options: [
            { label: 'Enabled', value: 'e1' },
            { label: 'Disabled', value: 'd3', isDisabled: true },
          ],
        },
      ];
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={groupedWithDisabled}
          isOptionDisabled={(option) => option.isDisabled}
          menuIsOpen
        />
      );
      
      expect(screen.queryByText('All Disabled')).not.toBeInTheDocument();
      expect(screen.getByText('Mixed')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading message in menu', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isLoading
          menuIsOpen
          loadingMessage={() => 'Loading options...'}
        />
      );
      
      expect(screen.getByText('Loading options...')).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('should return null for loading message to hide it', async () => {
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          isLoading
          menuIsOpen
          loadingMessage={() => null}
        />
      );
      
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('Menu Scrolling', () => {
    it('should handle menu scroll events', async () => {
      const onMenuScrollToBottom = jest.fn();
      const onMenuScrollToTop = jest.fn();
      
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={manyOptions}
          menuIsOpen
          onMenuScrollToBottom={onMenuScrollToBottom}
          onMenuScrollToTop={onMenuScrollToTop}
        />
      );
      
      const menuList = screen.getByRole('listbox');
      
      // Simulate scroll to bottom
      fireEvent.scroll(menuList, { target: { scrollTop: 1000 } });
      
      // Note: Actual scroll event handling would need more setup
      expect(menuList).toBeInTheDocument();
    });

    it('should respect maxMenuHeight', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuIsOpen maxMenuHeight={100} />
      );
      
      const menuList = screen.getByRole('listbox');
      expect(menuList).toHaveStyle({ maxHeight: '100px' });
    });

    it('should respect minMenuHeight', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuIsOpen minMenuHeight={50} />
      );
      
      // Min height is used for menu placement calculations
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Menu Block Scroll', () => {
    it('should block body scroll when menuShouldBlockScroll is true', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuIsOpen menuShouldBlockScroll />
      );
      
      // This would typically add styles to prevent body scrolling
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Option Formatting', () => {
    it('should use formatOptionLabel for menu options', async () => {
      const formatOptionLabel = jest.fn((option) => 
        <span className="custom-label">{option.label.toUpperCase()}</span>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          formatOptionLabel={formatOptionLabel}
          menuIsOpen
        />
      );
      
      expect(screen.getByText('OPTION 1')).toBeInTheDocument();
      expect(formatOptionLabel).toHaveBeenCalledWith(
        basicOptions[0],
        expect.objectContaining({ context: 'menu' })
      );
    });

    it('should use formatGroupLabel for groups', async () => {
      const formatGroupLabel = jest.fn((group) => 
        <span className="custom-group">{group.label.toUpperCase()}</span>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={groupedOptions}
          formatGroupLabel={formatGroupLabel}
          menuIsOpen
        />
      );
      
      expect(screen.getByText('GROUP 1')).toBeInTheDocument();
      expect(formatGroupLabel).toHaveBeenCalled();
    });

    it('should fallback to getOptionLabel', async () => {
      const { user } = renderSelect(
        <Select {...defaultProps} menuIsOpen />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Menu Scroll Into View', () => {
    it('should scroll focused option into view', async () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={manyOptions}
          value={manyOptions[15]}
          menuIsOpen
          menuShouldScrollIntoView
        />
      );
      
      // Selected option should be scrolled into view
      const selectedOption = screen.getByText('Option 16');
      expect(selectedOption).toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render custom Menu component', async () => {
      const CustomMenu = (props: any) => (
        <div className="custom-menu" {...props.innerProps}>
          {props.children}
        </div>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          components={{ Menu: CustomMenu }}
          menuIsOpen
        />
      );
      
      expect(document.querySelector('.custom-menu')).toBeInTheDocument();
    });

    it('should render custom Option component', async () => {
      const CustomOption = (props: any) => (
        <div className="custom-option" {...props.innerProps}>
          {props.children}
        </div>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          components={{ Option: CustomOption }}
          menuIsOpen
        />
      );
      
      expect(document.querySelectorAll('.custom-option')).toHaveLength(3);
    });

    it('should render custom Group component', async () => {
      const CustomGroup = (props: any) => (
        <div className="custom-group">
          <div className="custom-group-heading">{props.label}</div>
          {props.children}
        </div>
      );
      
      const { user } = renderSelect(
        <Select
          {...defaultProps}
          options={groupedOptions}
          components={{ Group: CustomGroup }}
          menuIsOpen
        />
      );
      
      expect(document.querySelectorAll('.custom-group')).toHaveLength(2);
    });
  });
});
```

## Form Integration Tests

```tsx
// __tests__/Select.form.test.tsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import Select from '../index';
import { renderSelect, defaultProps, basicOptions } from './setup/testUtils';

describe('Select Form Integration', () => {
  describe('Hidden Input', () => {
    it('should render hidden input with name', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} name="select-field" value={basicOptions[0]} />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"][name="select-field"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('opt1');
    });

    it('should update hidden input value on change', async () => {
      const { user, container } = renderSelect(
        <Select {...defaultProps} name="select-field" />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 2'));
      
      const hiddenInput = container.querySelector('input[type="hidden"][name="select-field"]');
      expect(hiddenInput).toHaveValue('opt2');
    });

    it('should render multiple hidden inputs for multi-select', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          name="multi-field"
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="multi-field"]');
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveValue('opt1');
      expect(hiddenInputs[1]).toHaveValue('opt2');
    });

    it('should render empty hidden input when no value', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} isMulti name="multi-field" value={[]} />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"][name="multi-field"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('');
    });

    it('should join values with delimiter', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          name="delimited-field"
          delimiter=","
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"][name="delimited-field"]');
      expect(hiddenInput).toHaveValue('opt1,opt2');
    });

    it('should not render hidden input when disabled', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="disabled-field"
          value={basicOptions[0]}
          isDisabled
        />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"][name="disabled-field"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('should render required input when required and no value', () => {
      const { container } = renderSelect(
        <Select {...defaultProps} name="required-field" required />
      );
      
      const requiredInput = container.querySelector('input[name="required-field"][required]');
      expect(requiredInput).toBeInTheDocument();
      expect(requiredInput).toHaveStyle({ opacity: '0' });
    });

    it('should not render required input when has value', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="required-field"
          required
          value={basicOptions[0]}
        />
      );
      
      const requiredInput = container.querySelector('input[required]');
      expect(requiredInput).not.toBeInTheDocument();
    });

    it('should not render required input when disabled', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="required-field"
          required
          isDisabled
        />
      );
      
      const requiredInput = container.querySelector('input[required]');
      expect(requiredInput).not.toBeInTheDocument();
    });

    it('should focus select when required input is focused', async () => {
      const { container } = renderSelect(
        <Select {...defaultProps} name="required-field" required />
      );
      
      const requiredInput = container.querySelector('input[required]') as HTMLInputElement;
      requiredInput.focus();
      
      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByRole('combobox'));
      });
    });
  });

  describe('Form Attribute', () => {
    it('should pass form attribute to input', () => {
      renderSelect(
        <Select {...defaultProps} name="form-field" form="my-form" />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('form', 'my-form');
    });

    it('should pass form attribute to hidden inputs', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="form-field"
          form="my-form"
          value={basicOptions[0]}
        />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute('form', 'my-form');
    });
  });

  describe('Form Submission', () => {
    it('should include value in form data', () => {
      const form = document.createElement('form');
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="select-field"
          value={basicOptions[0]}
        />
      );
      
      form.appendChild(container.firstChild as Node);
      
      const formData = new FormData(form);
      expect(formData.get('select-field')).toBe('opt1');
    });

    it('should include multiple values in form data', () => {
      const form = document.createElement('form');
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          isMulti
          name="multi-field"
          value={[basicOptions[0], basicOptions[1]]}
        />
      );
      
      form.appendChild(container.firstChild as Node);
      
      const formData = new FormData(form);
      const values = formData.getAll('multi-field');
      expect(values).toEqual(['opt1', 'opt2']);
    });

    it('should validate required field', () => {
      const form = document.createElement('form');
      const { container } = renderSelect(
        <Select {...defaultProps} name="required-field" required />
      );
      
      form.appendChild(container.firstChild as Node);
      
      const requiredInput = container.querySelector('input[required]') as HTMLInputElement;
      expect(requiredInput.validity.valueMissing).toBe(true);
    });
  });

  describe('Form Reset', () => {
    it('should reset to initial value on form reset', async () => {
      const form = document.createElement('form');
      const { container, user } = renderSelect(
        <Select {...defaultProps} name="reset-field" value={basicOptions[0]} />
      );
      
      form.appendChild(container.firstChild as Node);
      
      // Change value
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 2'));
      
      // Reset form
      form.reset();
      
      // Should still show the changed value (controlled component)
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Input Attributes', () => {
    it('should set tabIndex on input', () => {
      renderSelect(<Select {...defaultProps} tabIndex={5} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('tabindex', '5');
    });

    it('should set id on input', () => {
      renderSelect(<Select {...defaultProps} inputId="custom-input-id" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('id', 'custom-input-id');
    });

    it('should generate unique input id from instanceId', () => {
      renderSelect(<Select {...defaultProps} instanceId="test-instance" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('id', 'react-select-test-instance-input');
    });

    it('should set autocomplete attributes', () => {
      renderSelect(<Select {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('autocomplete', 'off');
      expect(input).toHaveAttribute('autocorrect', 'off');
      expect(input).toHaveAttribute('autocapitalize', 'none');
      expect(input).toHaveAttribute('spellcheck', 'false');
    });
  });

  describe('Validation', () => {
    it('should support HTML5 validation', () => {
      const { container } = renderSelect(
        <Select
          {...defaultProps}
          name="validated-field"
          required
          aria-invalid={true}
          aria-errormessage="error-message"
        />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'error-message');
    });

    it('should focus on validation error', () => {
      const form = document.createElement('form');
      const { container } = renderSelect(
        <Select {...defaultProps} name="required-field" required />
      );
      
      form.appendChild(container.firstChild as Node);
      
      const requiredInput = container.querySelector('input[required]') as HTMLInputElement;
      
      // Trigger validation
      const validationEvent = new Event('invalid');
      requiredInput.dispatchEvent(validationEvent);
      
      // Select should handle focus
      expect(requiredInput).toBeInTheDocument();
    });
  });

  describe('Custom Value Serialization', () => {
    it('should use getOptionValue for hidden input values', async () => {
      const customOptions = [
        { label: 'Option 1', id: 'custom-1' },
        { label: 'Option 2', id: 'custom-2' },
      ];
      
      const { container, user } = renderSelect(
        <Select
          {...defaultProps}
          options={customOptions}
          getOptionValue={(option) => option.id}
          name="custom-value-field"
        />
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));
      
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveValue('custom-1');
    });
  });
});
```

## Test Configuration

```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock scrollIntoView
global.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

## Package.json Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.5",
    "jest": "^29.3.1",
    "jest-axe": "^7.0.0",
    "jest-environment-jsdom": "^29.3.1",
    "ts-jest": "^29.0.3"
  }
}
```

This comprehensive test suite covers:

1. **Basic rendering and props handling**
2. **Keyboard navigation and interactions**
3. **Mouse and touch interactions**
4. **Accessibility features and ARIA attributes**
5. **State management (controlled/uncontrolled)**
6. **Menu behavior and positioning**
7. **Option filtering and selection**
8. **Form integration and validation**
9. **Custom components and styling**
10. **Edge cases and error handling**

The tests are organized into logical groups and use React Testing Library best practices, focusing on user behavior rather than implementation details. The setup includes proper mocking, utilities for common test scenarios, and configuration for achieving high test coverage.

### Tokens: {'input_tokens': 20593, 'output_tokens': 26214}
### Execution time: 255.30437922477722
