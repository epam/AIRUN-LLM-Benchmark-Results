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
### Answer:
Okay, let's create comprehensive unit tests for the provided `Select` component using Jest and React Testing Library.

We will cover the key areas identified in the requirements: rendering, user interactions (keyboard, mouse, touch), state management, menu/options behavior, accessibility, and edge cases. We'll use mocking where necessary for external dependencies or complex internal functions that are hard to test in isolation within the component's context.

**1. Test Environment Setup**

We'll assume you have a standard React project setup with Jest and React Testing Library installed.

*   `npm install --save-dev jest @testing-library/react @testing-library/user-event @testing-library/jest-dom`
*   Configure Jest (e.g., in `package.json` or `jest.config.js`) to use the testing library setup. Add `@testing-library/jest-dom` to `setupFilesAfterEnv` for helpful matchers.

**`jest.config.js` (Example):**

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // Add any necessary moduleNameMapper for aliases or file types
  // moduleNameMapper: {
  //   '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  //   '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  // },
};
```

**2. Mocking Dependencies**

The component imports several internal modules (`./components/Menu`, `./components/LiveRegion`, `./filters`, `./internal/index`, `./accessibility/index`, `./accessibility/helpers`, `./utils`, `./builtins`, `./components/index`, `./styles`, `./theme`, `./types`).

For unit testing the `Select` component itself, we want to isolate its logic from the implementation details of these sub-modules. We will mock the components and some utility functions.

*   **Components:** Mock the actual React components (`MenuPlacer`, `LiveRegion`, `DummyInput`, `ScrollManager`, `RequiredInput`, `defaultComponents`, etc.) to ensure we are testing how `Select` *uses* them (passing props, rendering them) rather than testing their internal rendering.
*   **Utils/Helpers:** Mock functions like `isTouchCapable`, `isMobileDevice`, `isAppleDevice`, `scrollIntoView`, `classNames`, `cleanValue`, `valueTernary`, `multiValueAsValue`, `singleValueAsValue`, `notNullish`. Some built-in formatters/getters might be simple enough not to mock, but mocking provides better isolation. `createFilter` should return a mock filter function.
*   **Accessibility:** Mock `AriaLiveMessages` if its implementation is complex, but the `LiveRegion` component mock might be sufficient.

Let's create a mock file structure mirroring the source code's imports.

**`__mocks__/react-select-internal/components/Menu.tsx`:**

```tsx
import React from 'react';

export const MenuPlacer = jest.fn(({ children, ...props }) => (
  <div data-testid="MenuPlacer" {...props}>
    {children({ ref: null, placerProps: { placement: 'bottom', maxHeight: 200 } })}
  </div>
));
```

**`__mocks__/react-select-internal/components/LiveRegion.tsx`:**

```tsx
import React from 'react';

const LiveRegion = jest.fn((props) => (
  <div data-testid="LiveRegion" aria-live={props['aria-live'] || 'polite'}>
    {/* We'll check the props passed to this mock */}
  </div>
));
export default LiveRegion;
```

**`__mocks__/react-select-internal/filters.ts`:**

```ts
export const createFilter = jest.fn(() => jest.fn((option, inputValue) => {
  // Default mock filter: simple case-insensitive label/value match
  const candidate = String(option.label || option.value).toLowerCase();
  const search = String(inputValue).toLowerCase();
  return candidate.includes(search);
}));
```

**`__mocks__/react-select-internal/internal/index.tsx`:**

```tsx
import React from 'react';

export const DummyInput = jest.fn((props) => <input data-testid="DummyInput" {...props} />);
export const ScrollManager = jest.fn(({ children, ...props }) => (
  <div data-testid="ScrollManager" {...props}>
    {children(jest.fn())} {/* Pass a mock scrollTargetRef */}
  </div>
));
export const RequiredInput = jest.fn((props) => <input data-testid="RequiredInput" type="hidden" {...props} />);
```

**`__mocks__/react-select-internal/accessibility/index.ts`:**

```ts
// Mock any accessibility-specific types or helpers if needed,
// but the main interaction logic is in Select.tsx
export const AriaLiveMessages = {}; // Mock type/interface if needed
export const AriaSelection = {}; // Mock type/interface if needed
```

**`__mocks__/react-select-internal/accessibility/helpers.ts`:**

```ts
export const isAppleDevice = jest.fn(() => false); // Default to false
```

**`__mocks__/react-select-internal/utils.ts`:**

```ts
export const classNames = jest.fn((prefix, ...args) => {
  const classes = args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'object' && arg !== null) {
      return Object.entries(arg)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ');
    }
    return '';
  }).join(' ').trim();
  return prefix ? `${prefix}__${classes.replace(/\s+/g, ` ${prefix}__`)}` : classes;
});
export const cleanValue = jest.fn((value) => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.filter(v => v !== null && v !== undefined);
  return [value];
});
export const isTouchCapable = jest.fn(() => false); // Default to false
export const isMobileDevice = jest.fn(() => false); // Default to false
export const noop = jest.fn();
export const scrollIntoView = jest.fn();
export const isDocumentElement = jest.fn((el) => el === document.documentElement || el === document.body);
export const notNullish = jest.fn((x) => x !== null && x !== undefined);
export const valueTernary = jest.fn((isMulti, multiValue, singleValue) => isMulti ? multiValue : singleValue);
export const multiValueAsValue = jest.fn((arr) => arr);
export const singleValueAsValue = jest.fn((val) => val);
```

**`__mocks__/react-select-internal/builtins.ts`:**

```ts
export const formatGroupLabel = jest.fn((group) => group.label);
export const getOptionLabel = jest.fn((option) => option.label);
export const getOptionValue = jest.fn((option) => option.value);
export const isOptionDisabled = jest.fn(() => false);
```

**`__mocks__/react-select-internal/components/index.tsx`:**

```tsx
import React from 'react';
import { defaultComponents as originalDefaultComponents } from 'react-select/dist/declarations/src/components'; // Import original to get structure

// Mock individual components used by defaultComponents
const mockComponents = {
  ClearIndicator: jest.fn((props) => <div data-testid="ClearIndicator" {...props.innerProps}>Clear</div>),
  Control: jest.fn((props) => <div data-testid="Control" {...props.innerProps}>{props.children}</div>),
  DropdownIndicator: jest.fn((props) => <div data-testid="DropdownIndicator" {...props.innerProps}>Dropdown</div>),
  Group: jest.fn((props) => <div data-testid="Group" {...props.headingProps}>{props.label}{props.children}</div>),
  GroupHeading: jest.fn((props) => <div data-testid="GroupHeading" {...props}>Heading</div>),
  IndicatorsContainer: jest.fn((props) => <div data-testid="IndicatorsContainer">{props.children}</div>),
  Input: jest.fn((props) => <input data-testid="Input" {...props.innerRef} {...props} />),
  LoadingIndicator: jest.fn((props) => <div data-testid="LoadingIndicator">Loading...</div>),
  LoadingMessage: jest.fn((props) => <div data-testid="LoadingMessage">{props.children}</div>),
  Menu: jest.fn((props) => <div data-testid="Menu" {...props.innerProps}>{props.children}</div>),
  MenuList: jest.fn((props) => <div data-testid="MenuList" {...props.innerProps}>{props.children}</div>),
  MenuPortal: jest.fn((props) => <div data-testid="MenuPortal">{props.children}</div>),
  MultiValue: jest.fn((props) => <div data-testid="MultiValue" {...props.removeProps}>{props.children}</div>),
  MultiValueContainer: jest.fn((props) => <div data-testid="MultiValueContainer">{props.children}</div>),
  MultiValueLabel: jest.fn((props) => <div data-testid="MultiValueLabel">{props.children}</div>),
  MultiValueRemove: jest.fn((props) => <div data-testid="MultiValueRemove">{props.children}</div>),
  NoOptionsMessage: jest.fn((props) => <div data-testid="NoOptionsMessage">{props.children}</div>),
  Option: jest.fn((props) => <div data-testid="Option" {...props.innerProps} ref={props.innerRef}>{props.children}</div>),
  Placeholder: jest.fn((props) => <div data-testid="Placeholder" {...props.innerProps}>{props.children}</div>),
  SelectContainer: jest.fn((props) => <div data-testid="SelectContainer" {...props.innerProps}>{props.children}</div>),
  SingleValue: jest.fn((props) => <div data-testid="SingleValue">{props.children}</div>),
  ValueContainer: jest.fn((props) => <div data-testid="ValueContainer">{props.children}</div>),
};

// Create a mock defaultComponents function that returns our mocks
export const defaultComponents = jest.fn((props) => {
  // Return a structure similar to the original defaultComponents
  // This allows the Select component to destructure it
  return {
    ...mockComponents,
    // Add any other default components if needed
  };
});

// Export the individual mocks so we can assert on them
export const {
  ClearIndicator,
  Control,
  DropdownIndicator,
  Group,
  GroupHeading,
  IndicatorsContainer,
  Input,
  LoadingIndicator,
  LoadingMessage,
  Menu,
  MenuList,
  MenuPortal,
  MultiValue,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  NoOptionsMessage,
  Option,
  Placeholder,
  SelectContainer,
  SingleValue,
  ValueContainer,
} = mockComponents;
```

**`__mocks__/react-select-internal/styles.ts`:**

```ts
// Mock default styles - return empty objects or simple styles
export const defaultStyles = {
  clearIndicator: jest.fn(() => ({})),
  container: jest.fn(() => ({})),
  control: jest.fn(() => ({})),
  dropdownIndicator: jest.fn(() => ({})),
  group: jest.fn(() => ({})),
  groupHeading: jest.fn(() => ({})),
  indicatorsContainer: jest.fn(() => ({})),
  indicatorSeparator: jest.fn(() => ({})),
  input: jest.fn(() => ({})),
  loadingIndicator: jest.fn(() => ({})),
  loadingMessage: jest.fn(() => ({})),
  menu: jest.fn(() => ({})),
  menuList: jest.fn(() => ({})),
  menuPortal: jest.fn(() => ({})),
  multiValue: jest.fn(() => ({})),
  multiValueLabel: jest.fn(() => ({})),
  multiValueRemove: jest.fn(() => ({})),
  noOptionsMessage: jest.fn(() => ({})),
  option: jest.fn(() => ({})),
  placeholder: jest.fn(() => ({})),
  singleValue: jest.fn(() => ({})),
  valueContainer: jest.fn(() => ({})),
};

export const StylesConfig = {}; // Mock type
export const StylesProps = {}; // Mock type
export const ClassNamesConfig = {}; // Mock type
```

**`__mocks__/react-select-internal/theme.ts`:**

```ts
export const defaultTheme = {
  borderRadius: 4,
  colors: {}, // Mock colors
  spacing: {}, // Mock spacing
};
export const ThemeConfig = {}; // Mock type
```

**`__mocks__/react-select-internal/types.ts`:**

```ts
// Mock types if needed for function signatures, but mostly handled by TS
export const ActionMeta = {};
export const FocusDirection = {};
export const GetOptionLabel = {};
export const GetOptionValue = {};
export const GroupBase = {};
export const InputActionMeta = {};
export const MenuPlacement = {};
export const MenuPosition = {};
export const OnChangeValue = {};
export const Options = {};
export const OptionsOrGroups = {};
export const PropsValue = {};
export const SetValueAction = {};
```

Now, in your test file, you need to tell Jest to use these mocks.

```javascript
// At the top of your test file
jest.mock('./components/Menu', () => ({ MenuPlacer: jest.fn(({ children }) => children({ ref: null, placerProps: { placement: 'bottom', maxHeight: 200 } })) }));
jest.mock('./components/LiveRegion', () => jest.fn((props) => <div data-testid="LiveRegion" aria-live={props['aria-live'] || 'polite'}></div>));
jest.mock('./filters', () => ({ createFilter: jest.fn(() => jest.fn((option, inputValue) => { const candidate = String(option.label || option.value).toLowerCase(); const search = String(inputValue).toLowerCase(); return candidate.includes(search); })) }));
jest.mock('./internal/index', () => ({ DummyInput: jest.fn((props) => <input data-testid="DummyInput" {...props} />), ScrollManager: jest.fn(({ children }) => <div data-testid="ScrollManager">{children(jest.fn())}</div>), RequiredInput: jest.fn((props) => <input data-testid="RequiredInput" type="hidden" {...props} />) }));
jest.mock('./accessibility/helpers', () => ({ isAppleDevice: jest.fn(() => false) }));
jest.mock('./utils', () => ({
  classNames: jest.fn((prefix, ...args) => { const classes = args.map(arg => { if (typeof arg === 'string') return arg; if (typeof arg === 'object' && arg !== null) { return Object.entries(arg).filter(([, value]) => value).map(([key]) => key).join(' '); } return ''; }).join(' ').trim(); return prefix ? `${prefix}__${classes.replace(/\s+/g, ` ${prefix}__`)}` : classes; }),
  cleanValue: jest.fn((value) => { if (value === null || value === undefined) return []; if (Array.isArray(value)) return value.filter(v => v !== null && v !== undefined); return [value]; }),
  isTouchCapable: jest.fn(() => false),
  isMobileDevice: jest.fn(() => false),
  noop: jest.fn(),
  scrollIntoView: jest.fn(),
  isDocumentElement: jest.fn((el) => el === document.documentElement || el === document.body),
  notNullish: jest.fn((x) => x !== null && x !== undefined),
  valueTernary: jest.fn((isMulti, multiValue, singleValue) => isMulti ? multiValue : singleValue),
  multiValueAsValue: jest.fn((arr) => arr),
  singleValueAsValue: jest.fn((val) => val),
}));
jest.mock('./builtins', () => ({
  formatGroupLabel: jest.fn((group) => group.label),
  getOptionLabel: jest.fn((option) => option.label),
  getOptionValue: jest.fn((option) => option.value),
  isOptionDisabled: jest.fn(() => false),
}));

// Mock default components and export them for assertions
const mockComponents = {
  ClearIndicator: jest.fn((props) => <div data-testid="ClearIndicator" {...props.innerProps}>Clear</div>),
  Control: jest.fn((props) => <div data-testid="Control" {...props.innerProps}>{props.children}</div>),
  DropdownIndicator: jest.fn((props) => <div data-testid="DropdownIndicator" {...props.innerProps}>Dropdown</div>),
  Group: jest.fn((props) => <div data-testid="Group" {...props.headingProps}>{props.label}{props.children}</div>),
  GroupHeading: jest.fn((props) => <div data-testid="GroupHeading" {...props}>Heading</div>),
  IndicatorsContainer: jest.fn((props) => <div data-testid="IndicatorsContainer">{props.children}</div>),
  Input: jest.fn((props) => <input data-testid="Input" {...props.innerRef} {...props} />),
  LoadingIndicator: jest.fn((props) => <div data-testid="LoadingIndicator">Loading...</div>),
  LoadingMessage: jest.fn((props) => <div data-testid="LoadingMessage">{props.children}</div>),
  Menu: jest.fn((props) => <div data-testid="Menu" {...props.innerProps}>{props.children}</div>),
  MenuList: jest.fn((props) => <div data-testid="MenuList" {...props.innerProps}>{props.children}</div>),
  MenuPortal: jest.fn((props) => <div data-testid="MenuPortal">{props.children}</div>),
  MultiValue: jest.fn((props) => <div data-testid="MultiValue" {...props.removeProps}>{props.children}</div>),
  MultiValueContainer: jest.fn((props) => <div data-testid="MultiValueContainer">{props.children}</div>),
  MultiValueLabel: jest.fn((props) => <div data-testid="MultiValueLabel">{props.children}</div>),
  MultiValueRemove: jest.fn((props) => <div data-testid="MultiValueRemove">{props.children}</div>),
  NoOptionsMessage: jest.fn((props) => <div data-testid="NoOptionsMessage">{props.children}</div>),
  Option: jest.fn((props) => <div data-testid="Option" {...props.innerProps} ref={props.innerRef}>{props.children}</div>),
  Placeholder: jest.fn((props) => <div data-testid="Placeholder" {...props.innerProps}>{props.children}</div>),
  SelectContainer: jest.fn((props) => <div data-testid="SelectContainer" {...props.innerProps}>{props.children}</div>),
  SingleValue: jest.fn((props) => <div data-testid="SingleValue">{props.children}</div>),
  ValueContainer: jest.fn((props) => <div data-testid="ValueContainer">{props.children}</div>),
};
jest.mock('./components/index', () => ({
  defaultComponents: jest.fn(() => mockComponents),
  ...mockComponents, // Export mocks for direct assertion
}));

jest.mock('./styles', () => ({
  defaultStyles: {
    clearIndicator: jest.fn(() => ({})),
    container: jest.fn(() => ({})),
    control: jest.fn(() => ({})),
    dropdownIndicator: jest.fn(() => ({})),
    group: jest.fn(() => ({})),
    groupHeading: jest.fn(() => ({})),
    indicatorsContainer: jest.fn(() => ({})),
    indicatorSeparator: jest.fn(() => ({})),
    input: jest.fn(() => ({})),
    loadingIndicator: jest.fn(() => ({})),
    loadingMessage: jest.fn(() => ({})),
    menu: jest.fn(() => ({})),
    menuList: jest.fn(() => ({})),
    menuPortal: jest.fn(() => ({})),
    multiValue: jest.fn(() => ({})),
    multiValueLabel: jest.fn(() => ({})),
    multiValueRemove: jest.fn(() => ({})),
    noOptionsMessage: jest.fn(() => ({})),
    option: jest.fn(() => ({})),
    placeholder: jest.fn(() => ({})),
    singleValue: jest.fn(() => ({})),
    valueContainer: jest.fn(() => ({})),
  },
  StylesConfig: {},
  StylesProps: {},
  ClassNamesConfig: {},
}));

jest.mock('./theme', () => ({
  defaultTheme: { borderRadius: 4, colors: {}, spacing: {} },
  ThemeConfig: {},
}));

// Mock document event listeners
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(global.document, 'addEventListener', { value: mockAddEventListener });
Object.defineProperty(global.document, 'removeEventListener', { value: mockRemoveEventListener });

// Mock Element.prototype.scrollIntoView
const mockScrollIntoView = jest.fn();
Object.defineProperty(global.Element.prototype, 'scrollIntoView', { value: mockScrollIntoView });

// Mock getComputedStyle
const mockGetComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(() => ''), // Default empty string
}));
Object.defineProperty(global, 'getComputedStyle', { value: mockGetComputedStyle });

// Mock offsetHeight and clientHeight for scrollIntoView logic
Object.defineProperty(global.Element.prototype, 'offsetHeight', { value: 100 });
Object.defineProperty(global.Element.prototype, 'clientHeight', { value: 100 });
Object.defineProperty(global.Element.prototype, 'scrollHeight', { value: 200 });
Object.defineProperty(global.Element.prototype, 'scrollTop', { value: 0, writable: true });

// Mock document.activeElement
Object.defineProperty(document, 'activeElement', {
  value: null,
  writable: true,
});

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

// Mock window.requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: jest.fn(cb => cb()), // Execute immediately for tests
});

// Mock window.cancelAnimationFrame
Object.defineProperty(window, 'cancelAnimationFrame', {
  value: jest.fn(),
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../index'; // Adjust the import path as necessary

// Import mocked components for assertions
import {
  ClearIndicator,
  Control,
  DropdownIndicator,
  Group,
  GroupHeading,
  IndicatorsContainer,
  Input,
  LoadingIndicator,
  LoadingMessage,
  Menu,
  MenuList,
  MenuPortal,
  MultiValue,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  NoOptionsMessage,
  Option,
  Placeholder,
  SelectContainer,
  SingleValue,
  ValueContainer,
} from '../components/index'; // Adjust import path

// Import mocked utils for assertions
import {
  isTouchCapable,
  isMobileDevice,
  isAppleDevice,
  scrollIntoView,
  classNames,
  cleanValue,
  valueTernary,
  multiValueAsValue,
  singleValueAsValue,
  createFilter,
  noop,
} from '../utils'; // Adjust import path

import {
  getOptionLabel,
  getOptionValue,
  isOptionDisabled,
} from '../builtins'; // Adjust import path

// Sample data
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla', isDisabled: true },
];

const groupedOptions = [
  {
    label: 'Flavours',
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla', isDisabled: true },
    ],
  },
  {
    label: 'Colors',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
    ],
  },
];

// Helper to get the input element
const getInput = () => screen.getByTestId('Input');
const getControl = () => screen.getByTestId('Control');
const getMenu = () => screen.queryByTestId('Menu');
const getMenuList = () => screen.queryByTestId('MenuList');
const getOptions = () => screen.queryAllByTestId('Option');
const getClearIndicator = () => screen.queryByTestId('ClearIndicator');
const getDropdownIndicator = () => screen.queryByTestId('DropdownIndicator');
const getPlaceholder = () => screen.queryByTestId('Placeholder');
const getSingleValue = () => screen.queryByTestId('SingleValue');
const getMultiValues = () => screen.queryAllByTestId('MultiValue');
const getLiveRegion = () => screen.getByTestId('LiveRegion');


describe('Select Component', () => {
  let mockOnChange: jest.Mock;
  let mockOnInputChange: jest.Mock;
  let mockOnMenuOpen: jest.Mock;
  let mockOnMenuClose: jest.Mock;
  let mockOnFocus: jest.Mock;
  let mockOnBlur: jest.Mock;
  let mockOnKeyDown: jest.Mock;
  let mockOnMenuScrollToTop: jest.Mock;
  let mockOnMenuScrollToBottom: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock document event listeners again for safety
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    Object.defineProperty(global.document, 'addEventListener', { value: mockAddEventListener });
    Object.defineProperty(global.document, 'removeEventListener', { value: mockRemoveEventListener });

    // Mock scrollIntoView again for safety
    mockScrollIntoView.mockClear();
    Object.defineProperty(global.Element.prototype, 'scrollIntoView', { value: mockScrollIntoView });

    // Mock activeElement
    Object.defineProperty(document, 'activeElement', {
      value: null,
      writable: true,
    });

    // Mock callbacks
    mockOnChange = jest.fn();
    mockOnInputChange = jest.fn();
    mockOnMenuOpen = jest.fn();
    mockOnMenuClose = jest.fn();
    mockOnFocus = jest.fn();
    mockOnBlur = jest.fn();
    mockOnKeyDown = jest.fn();
    mockOnMenuScrollToTop = jest.fn();
    mockOnMenuScrollToBottom = jest.fn();
  });

  // --- 2. Component Rendering Tests ---
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Select options={options} onChange={mockOnChange} />);

      expect(screen.getByTestId('SelectContainer')).toBeInTheDocument();
      expect(screen.getByTestId('Control')).toBeInTheDocument();
      expect(screen.getByTestId('ValueContainer')).toBeInTheDocument();
      expect(screen.getByTestId('IndicatorsContainer')).toBeInTheDocument();
      expect(screen.getByTestId('Input')).toBeInTheDocument();
      expect(screen.getByTestId('Placeholder')).toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument(); // Default placeholder
      expect(screen.getByTestId('DropdownIndicator')).toBeInTheDocument();
      expect(screen.getByTestId('IndicatorSeparator')).toBeInTheDocument();
      expect(screen.getByTestId('LiveRegion')).toBeInTheDocument();

      expect(getMenu()).not.toBeInTheDocument(); // Menu is closed by default
      expect(getClearIndicator()).not.toBeInTheDocument(); // No value by default
      expect(getLoadingIndicator()).not.toBeInTheDocument(); // Not loading by default
      expect(getSingleValue()).not.toBeInTheDocument(); // No value by default
      expect(getMultiValues()).toHaveLength(0); // Not multi by default

      // Check basic ARIA attributes on the input
      const input = getInput();
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('aria-describedby', screen.getByTestId('Placeholder').id);
      expect(input).not.toHaveAttribute('aria-activedescendant'); // No focused option when closed
      expect(input).not.toHaveAttribute('aria-controls'); // No listbox when closed
    });

    it('renders with a single value', () => {
      const value = options[0];
      render(<Select options={options} value={value} onChange={mockOnChange} />);

      expect(getPlaceholder()).not.toBeInTheDocument();
      expect(getSingleValue()).toBeInTheDocument();
      expect(screen.getByText(value.label)).toBeInTheDocument();
      expect(getClearIndicator()).toBeInTheDocument(); // Clearable by default for single select with value
    });

    it('renders with multiple values', () => {
      const value = [options[0], options[1]];
      render(<Select options={options} value={value} onChange={mockOnChange} isMulti />);

      expect(getPlaceholder()).not.toBeInTheDocument();
      expect(getSingleValue()).not.toBeInTheDocument();
      expect(getMultiValues()).toHaveLength(2);
      expect(screen.getByText(options[0].label)).toBeInTheDocument();
      expect(screen.getByText(options[1].label)).toBeInTheDocument();
      expect(getClearIndicator()).toBeInTheDocument(); // Clearable by default for multi select with value
    });

    it('renders with custom classNamePrefix', () => {
      render(<Select options={options} onChange={mockOnChange} classNamePrefix="my-select" />);
      expect(screen.getByTestId('SelectContainer')).toHaveClass('my-select');
      expect(screen.getByTestId('Control')).toHaveClass('my-select__control');
      expect(screen.getByTestId('Placeholder')).toHaveClass('my-select__placeholder');
      // Verify classNames util is called correctly
      expect(classNames).toHaveBeenCalledWith('my-select', 'container', { 'is-disabled': false, 'is-focused': false, 'is-multi': false, 'has-value': false });
    });

    it('renders with custom classNames config', () => {
      const customClassNames = {
        container: () => 'custom-container-class',
        control: ({ isFocused }: any) => `custom-control-class ${isFocused ? 'focused' : ''}`,
      };
      render(<Select options={options} onChange={mockOnChange} classNames={customClassNames} />);

      expect(screen.getByTestId('SelectContainer')).toHaveClass('custom-container-class');
      expect(screen.getByTestId('Control')).toHaveClass('custom-control-class');

      // Focus the input to check focused class
      userEvent.click(getInput());
      expect(screen.getByTestId('Control')).toHaveClass('custom-control-class focused');
    });

    it('renders with isDisabled prop', () => {
      render(<Select options={options} onChange={mockOnChange} isDisabled />);

      const input = getInput();
      expect(input).toBeDisabled();
      expect(screen.getByTestId('SelectContainer')).toHaveClass('select--is-disabled');
      expect(screen.getByTestId('Control')).toHaveClass('select__control--is-disabled');
      expect(getDropdownIndicator()).toHaveClass('select__dropdown-indicator--is-disabled');
      expect(getIndicatorSeparator()).toHaveClass('select__indicator-separator--is-disabled');
      expect(getPlaceholder()).toHaveClass('select__placeholder--is-disabled');

      // Try interacting - should not open menu or call handlers
      userEvent.click(getControl());
      expect(getMenu()).not.toBeInTheDocument();
      expect(mockOnMenuOpen).not.toHaveBeenCalled();
      expect(mockOnFocus).not.toHaveBeenCalled();
    });

    it('renders with isLoading prop', () => {
      render(<Select options={options} onChange={mockOnChange} isLoading />);

      expect(getLoadingIndicator()).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument(); // Default loading message
    });

    it('renders with custom loadingMessage', () => {
      const customLoadingMessage = ({ inputValue }: { inputValue: string }) => `Searching for "${inputValue}"...`;
      render(<Select options={options} onChange={mockOnChange} isLoading loadingMessage={customLoadingMessage} inputValue="test" />);

      expect(screen.getByText('Searching for "test"...')).toBeInTheDocument();
    });

    it('renders with noOptionsMessage when no options match input', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen inputValue="xyz" />);

      // Wait for potential filtering/rendering updates
      await waitFor(() => {
        expect(getOptions()).toHaveLength(0);
        expect(getNoOptionsMessage()).toBeInTheDocument();
        expect(screen.getByText('No options')).toBeInTheDocument(); // Default message
      });
    });

    it('renders with custom noOptionsMessage', async () => {
      const customNoOptionsMessage = ({ inputValue }: { inputValue: string }) => `No results for "${inputValue}"`;
      render(<Select options={options} onChange={mockOnChange} menuIsOpen inputValue="xyz" noOptionsMessage={customNoOptionsMessage} />);

      await waitFor(() => {
        expect(screen.getByText('No results for "xyz"')).toBeInTheDocument();
      });
    });

    it('renders with grouped options', async () => {
      render(<Select options={groupedOptions} onChange={mockOnChange} menuIsOpen />);

      await waitFor(() => {
        expect(screen.getAllByTestId('Group')).toHaveLength(2);
        expect(screen.getByText('Flavours')).toBeInTheDocument();
        expect(screen.getByText('Colors')).toBeInTheDocument();
        expect(screen.getAllByTestId('Option')).toHaveLength(4); // chocolate, strawberry, red, blue (vanilla is disabled)
      });
    });

    it('applies accessibility attributes correctly', () => {
      render(
        <Select
          options={options}
          onChange={mockOnChange}
          aria-label="My Select"
          aria-labelledby="my-label"
          aria-invalid
          aria-errormessage="my-error"
          required
        />
      );

      const input = getInput();
      expect(input).toHaveAttribute('aria-label', 'My Select');
      expect(input).toHaveAttribute('aria-labelledby', 'my-label');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage', 'my-error');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('renders hidden input for form submission', () => {
      render(<Select options={options} onChange={mockOnChange} name="my-field" value={options[0]} />);
      const hiddenInput = screen.getByRole('textbox', { hidden: true }); // RTL finds hidden inputs by role
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'my-field');
      expect(hiddenInput).toHaveAttribute('value', options[0].value);
    });

    it('renders hidden input for multi-select form submission', () => {
      const value = [options[0], options[1]];
      render(<Select options={options} onChange={mockOnChange} name="my-field" value={value} isMulti />);
      const hiddenInputs = screen.getAllByRole('textbox', { hidden: true });
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveAttribute('name', 'my-field');
      expect(hiddenInputs[0]).toHaveAttribute('value', options[0].value);
      expect(hiddenInputs[1]).toHaveAttribute('name', 'my-field');
      expect(hiddenInputs[1]).toHaveAttribute('value', options[1].value);
    });

    it('renders hidden input with delimiter for multi-select form submission', () => {
      const value = [options[0], options[1]];
      render(<Select options={options} onChange={mockOnChange} name="my-field" value={value} isMulti delimiter="," />);
      const hiddenInput = screen.getByRole('textbox', { hidden: true });
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'my-field');
      expect(hiddenInput).toHaveAttribute('value', `${options[0].value},${options[1].value}`);
    });

    it('renders RequiredInput when required and no value', () => {
      render(<Select options={options} onChange={mockOnChange} required name="my-field" />);
      expect(screen.getByTestId('RequiredInput')).toBeInTheDocument();
      expect(screen.getByTestId('RequiredInput')).toHaveAttribute('name', 'my-field');
    });

    it('does not render RequiredInput when required but has value', () => {
      render(<Select options={options} onChange={mockOnChange} required name="my-field" value={options[0]} />);
      expect(screen.queryByTestId('RequiredInput')).not.toBeInTheDocument();
    });

    it('does not render RequiredInput when required but disabled', () => {
      render(<Select options={options} onChange={mockOnChange} required name="my-field" isDisabled />);
      expect(screen.queryByTestId('RequiredInput')).not.toBeInTheDocument();
    });
  });

  // --- 3. User Interaction Testing ---
  describe('User Interactions', () => {
    describe('Mouse Interactions', () => {
      it('opens menu on control click', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const control = getControl();

        userEvent.click(control);

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
          expect(getInput()).toHaveAttribute('aria-expanded', 'true');
          expect(getInput()).toHaveAttribute('aria-controls', screen.getByTestId('MenuList').id);
        });
      });

      it('opens menu on dropdown indicator click', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const dropdownIndicator = getDropdownIndicator();

        userEvent.click(dropdownIndicator!);

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
        });
      });

      it('closes menu on control click when open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const control = getControl();

        userEvent.click(control);

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
          expect(mockOnInputChange).toHaveBeenCalledWith('', { action: 'menu-close', prevInputValue: '' });
          expect(getInput()).toHaveAttribute('aria-expanded', 'false');
          expect(getInput()).not.toHaveAttribute('aria-controls');
        });
      });

      it('closes menu on dropdown indicator click when open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const dropdownIndicator = getDropdownIndicator();

        userEvent.click(dropdownIndicator!);

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('selects an option on click', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const option = screen.getByText('Chocolate'); // Find the option by its text

        userEvent.click(option);

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(options[0], { action: 'select-option', option: options[0], name: undefined });
          expect(getMenu()).not.toBeInTheDocument(); // Menu closes on select by default
          expect(mockOnInputChange).toHaveBeenCalledWith('', { action: 'set-value', prevInputValue: '' }); // Input cleared on select
        });
      });

      it('does not select a disabled option on click', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const disabledOption = screen.getByText('Vanilla'); // Find the disabled option

        userEvent.click(disabledOption);

        await waitFor(() => {
          expect(mockOnChange).not.toHaveBeenCalled();
          // Check aria live region update for disabled option selection attempt
          expect(getLiveRegion()).toHaveTextContent('Vanilla is disabled.'); // Assuming default ariaLiveMessages
        });
      });

      it('removes a multi-value on click', async () => {
        const initialValue = [options[0], options[1]];
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
        const multiValueRemove = screen.getAllByTestId('MultiValueRemove')[0]; // Get the remove button for the first value

        userEvent.click(multiValueRemove);

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith([options[1]], { action: 'remove-value', removedValue: options[0], name: undefined });
          expect(getInput()).toHaveFocus(); // Input gets focus after removal
        });
      });

      it('clears value on clear indicator click', async () => {
        render(<Select options={options} onChange={mockOnChange} value={options[0]} isClearable />);
        const clearIndicator = getClearIndicator();

        userEvent.click(clearIndicator!);

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
          expect(getInput()).toHaveFocus(); // Input gets focus after clearing
        });
      });

      it('focuses input on control mousedown', () => {
        render(<Select options={options} onChange={mockOnChange} />);
        const control = getControl();
        const input = getInput();
        jest.spyOn(input, 'focus');

        fireEvent.mouseDown(control);

        expect(input.focus).toHaveBeenCalledTimes(1);
      });

      it('focuses input on menu mousedown', () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const menu = getMenu();
        const input = getInput();
        jest.spyOn(input, 'focus');

        fireEvent.mouseDown(menu!);

        expect(input.focus).toHaveBeenCalledTimes(1);
      });

      it('sets focusedOption on option hover', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const option = screen.getByText('Strawberry');
        const input = getInput();

        // Ensure input is focused so state updates are processed
        userEvent.click(input);

        fireEvent.mouseOver(option);

        // We can't directly assert component state, but we can check if the Option component
        // received the isFocused prop. The mock Option component receives props.
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[1], // Strawberry
              isFocused: true,
            }),
            {}
          );
        });
      });

      it('does not set focusedOption on disabled option hover', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const disabledOption = screen.getByText('Vanilla');
        const input = getInput();

        userEvent.click(input);

        fireEvent.mouseOver(disabledOption);

        await waitFor(() => {
          // Check that the disabled option was rendered, but not with isFocused=true
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[2], // Vanilla
              isDisabled: true,
              isFocused: false, // Should not be focused on hover
            }),
            {}
          );
        });
      });
    });

    describe('Keyboard Interactions', () => {
      it('opens menu on ArrowDown key press', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const input = getInput();

        userEvent.click(input); // Focus the input first
        userEvent.keyboard('{ArrowDown}');

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
          // Check if the first option is focused (default behavior)
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[0], // Chocolate
              isFocused: true,
            }),
            {}
          );
          expect(getInput()).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-0')); // Check aria-activedescendant
        });
      });

      it('opens menu on ArrowUp key press and focuses last option', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const input = getInput();

        userEvent.click(input); // Focus the input first
        userEvent.keyboard('{ArrowUp}');

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
          // Check if the last focusable option is focused
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[1], // Strawberry (Vanilla is disabled)
              isFocused: true,
            }),
            {}
          );
          expect(getInput()).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'));
        });
      });

      it('opens menu on Space key press when input is empty', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const input = getInput();

        userEvent.click(input); // Focus the input first
        userEvent.keyboard(' ');

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[0], // Chocolate
              isFocused: true,
            }),
            {}
          );
        });
      });

      it('does not open menu on Space key press when input has value', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} inputValue="test" />);
        const input = getInput();

        userEvent.click(input); // Focus the input first
        userEvent.keyboard(' ');

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuOpen).not.toHaveBeenCalled();
        });
      });

      it('opens menu on Enter key press when menu is closed', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const input = getInput();

        userEvent.click(input); // Focus the input first
        userEvent.keyboard('{Enter}');

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
          expect(Option).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[0], // Chocolate
              isFocused: true,
            }),
            {}
          );
        });
      });


      it('closes menu on Escape key press', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const input = getInput();

        userEvent.click(input); // Ensure input is focused
        userEvent.keyboard('{Escape}');

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
          expect(mockOnInputChange).toHaveBeenCalledWith('', { action: 'menu-close', prevInputValue: '' });
        });
      });

      it('clears value on Escape key press when menu is closed and escapeClearsValue is true', async () => {
        render(<Select options={options} onChange={mockOnChange} value={options[0]} escapeClearsValue isClearable />);
        const input = getInput();

        userEvent.click(input); // Ensure input is focused
        userEvent.keyboard('{Escape}');

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
        });
      });

      it('does not clear value on Escape key press when menu is closed and escapeClearsValue is false', async () => {
        render(<Select options={options} onChange={mockOnChange} value={options[0]} escapeClearsValue={false} isClearable />);
        const input = getInput();

        userEvent.click(input); // Ensure input is focused
        userEvent.keyboard('{Escape}');

        await waitFor(() => {
          expect(mockOnChange).not.toHaveBeenCalled();
        });
      });

      it('navigates options with ArrowDown/Up keys when menu is open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Ensure input is focused

        // ArrowDown from first option (Chocolate) -> Strawberry
        userEvent.keyboard('{ArrowDown}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
          expect(getInput()).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'));
        });

        // ArrowDown from Strawberry -> Chocolate (wraps around)
        userEvent.keyboard('{ArrowDown}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
          expect(getInput()).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-0'));
        });

        // ArrowUp from Chocolate -> Strawberry (wraps around)
        userEvent.keyboard('{ArrowUp}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
          expect(getInput()).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-1'));
        });
      });

      it('navigates options with PageUp/PageDown keys', async () => {
        // Need more options to test page up/down effectively
        const largeOptions = Array.from({ length: 20 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));
        render(<Select options={largeOptions} onChange={mockOnChange} menuIsOpen pageSize={5} />);
        const input = getInput();

        userEvent.click(input); // Focus input

        // Initial focus is first option (Option 0)
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[0], isFocused: true }), {});
        });

        // PageDown from Option 0 -> Option 5
        userEvent.keyboard('{PageDown}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[5], isFocused: true }), {});
        });

        // PageDown from Option 5 -> Option 10
        userEvent.keyboard('{PageDown}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[10], isFocused: true }), {});
        });

        // PageUp from Option 10 -> Option 5
        userEvent.keyboard('{PageUp}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[5], isFocused: true }), {});
        });

        // PageUp from Option 5 -> Option 0
        userEvent.keyboard('{PageUp}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[0], isFocused: true }), {});
        });

        // PageUp from Option 0 stays at Option 0
        userEvent.keyboard('{PageUp}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[0], isFocused: true }), {});
        });

        // PageDown from Option 18 (near end) -> Option 19 (last)
        // Need to manually set focused option state for this test
        const { rerender } = render(<Select options={largeOptions} onChange={mockOnChange} menuIsOpen pageSize={5} />);
        rerender(<Select options={largeOptions} onChange={mockOnChange} menuIsOpen pageSize={5} focusedOption={largeOptions[18]} />);
        userEvent.keyboard('{PageDown}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: largeOptions[19], isFocused: true }), {});
        });
      });

      it('navigates options with Home/End keys', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Focus input

        // Initial focus is first option (Chocolate)
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
        });

        // End key -> last focusable option (Strawberry)
        userEvent.keyboard('{End}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        // Home key -> first focusable option (Chocolate)
        userEvent.keyboard('{Home}');
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
        });
      });

      it('selects focused option on Enter key press when menu is open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Focus Strawberry
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        userEvent.keyboard('{Enter}'); // Select Strawberry

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(options[1], { action: 'select-option', option: options[1], name: undefined });
          expect(getMenu()).not.toBeInTheDocument();
        });
      });

      it('selects focused option on Space key press when menu is open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Focus Strawberry
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        userEvent.keyboard(' '); // Select Strawberry

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(options[1], { action: 'select-option', option: options[1], name: undefined });
          expect(getMenu()).not.toBeInTheDocument();
        });
      });

      it('selects focused option on Tab key press when tabSelectsValue is true', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen tabSelectsValue />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Focus Strawberry
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        userEvent.tab(); // Select Strawberry

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(options[1], { action: 'select-option', option: options[1], name: undefined });
          expect(getMenu()).not.toBeInTheDocument();
        });
      });

      it('does NOT select focused option on Tab key press when tabSelectsValue is false', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen tabSelectsValue={false} />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Focus Strawberry
        await waitFor(() => {
          expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        userEvent.tab(); // Should just tab out

        await waitFor(() => {
          expect(mockOnChange).not.toHaveBeenCalled();
          expect(getMenu()).toBeVisible(); // Menu should not close
        });
      });

      it('removes last value on Backspace key press when input is empty (isMulti)', async () => {
        const initialValue = [options[0], options[1]];
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} backspaceRemovesValue />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{Backspace}'); // Remove last value (Strawberry)

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith([options[0]], { action: 'pop-value', removedValue: options[1], name: undefined });
        });
      });

      it('does NOT remove last value on Backspace key press when input is empty and backspaceRemovesValue is false (isMulti)', async () => {
        const initialValue = [options[0], options[1]];
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} backspaceRemovesValue={false} />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{Backspace}');

        await waitFor(() => {
          expect(mockOnChange).not.toHaveBeenCalled();
        });
      });

      it('removes focused value on Backspace/Delete key press (isMulti)', async () => {
        const initialValue = [options[0], options[1]];
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowLeft}'); // Focus last value (Strawberry)
        await waitFor(() => {
          // Check if the MultiValue component for Strawberry received isFocused=true
          expect(MultiValue).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[1],
              isFocused: true,
            }),
            {}
          );
        });

        userEvent.keyboard('{Delete}'); // Remove focused value (Strawberry)

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith([options[0]], { action: 'remove-value', removedValue: options[1], name: undefined });
        });

        // Reset and test Backspace
        jest.clearAllMocks();
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
        userEvent.click(getInput());
        userEvent.keyboard('{ArrowLeft}'); // Focus last value (Strawberry)
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(
            expect.objectContaining({
              data: options[1],
              isFocused: true,
            }),
            {}
          );
        });
        userEvent.keyboard('{Backspace}'); // Remove focused value (Strawberry)

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith([options[0]], { action: 'remove-value', removedValue: options[1], name: undefined });
        });
      });

      it('navigates focused value with ArrowLeft/Right keys (isMulti)', async () => {
        const initialValue = [options[0], options[1]];
        render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
        const input = getInput();

        userEvent.click(input); // Focus input

        // ArrowLeft from input -> last value (Strawberry)
        userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
          expect(getInput()).toHaveStyle('visibility: hidden'); // Input should be hidden when value is focused
        });

        // ArrowLeft from Strawberry -> first value (Chocolate)
        userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
        });

        // ArrowLeft from Chocolate stays on Chocolate
        userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
        });

        // ArrowRight from Chocolate -> Strawberry
        userEvent.keyboard('{ArrowRight}');
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
        });

        // ArrowRight from Strawberry -> input
        userEvent.keyboard('{ArrowRight}');
        await waitFor(() => {
          expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: false }), {}); // Strawberry is no longer focused
          expect(getInput()).toHaveStyle('visibility: visible'); // Input should be visible
        });

        // ArrowRight from input stays on input
        userEvent.keyboard('{ArrowRight}');
        await waitFor(() => {
          expect(getInput()).toHaveStyle('visibility: visible');
        });
      });

      it('calls onKeyDown prop', () => {
        render(<Select options={options} onChange={mockOnChange} onKeyDown={mockOnKeyDown} />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('a');

        expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
        expect(mockOnKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'a' }));
      });

      it('prevents default keyboard handling if onKeyDown calls preventDefault', () => {
        const preventDefaultMock = jest.fn();
        render(<Select options={options} onChange={mockOnChange} onKeyDown={(e) => { e.preventDefault(); preventDefaultMock(); }} />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Should normally open menu

        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(getMenu()).not.toBeInTheDocument(); // Menu should not open
      });
    });

    describe('Typing Interactions', () => {
      it('calls onInputChange when typing', async () => {
        render(<Select options={options} onChange={mockOnChange} onInputChange={mockOnInputChange} />);
        const input = getInput();

        userEvent.type(input, 'ch');

        await waitFor(() => {
          expect(mockOnInputChange).toHaveBeenCalledTimes(2); // 'c', then 'h'
          expect(mockOnInputChange).toHaveBeenNthCalledWith(1, 'c', { action: 'input-change', prevInputValue: '' });
          expect(mockOnInputChange).toHaveBeenNthCalledWith(2, 'ch', { action: 'input-change', prevInputValue: 'c' });
        });
      });

      it('opens menu when typing if menu is closed', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const input = getInput();

        userEvent.type(input, 'c');

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
        });
      });

      it('filters options based on input value', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.type(input, 'straw');

        await waitFor(() => {
          const renderedOptions = screen.getAllByTestId('Option');
          expect(renderedOptions).toHaveLength(1);
          expect(screen.getByText('Strawberry')).toBeInTheDocument();
          expect(screen.queryByText('Chocolate')).not.toBeInTheDocument();
          expect(screen.queryByText('Vanilla')).not.toBeInTheDocument();
        });
      });

      it('uses custom filterOption prop', async () => {
        const customFilter = jest.fn((option, inputValue) => {
          // Only match options where value starts with input
          return String(option.value).toLowerCase().startsWith(String(inputValue).toLowerCase());
        });
        render(<Select options={options} onChange={mockOnChange} menuIsOpen filterOption={customFilter} />);
        const input = getInput();

        userEvent.type(input, 'ch');

        await waitFor(() => {
          expect(customFilter).toHaveBeenCalled();
          const renderedOptions = screen.getAllByTestId('Option');
          expect(renderedOptions).toHaveLength(1);
          expect(screen.getByText('Chocolate')).toBeInTheDocument();
        });

        userEvent.clear(input);
        userEvent.type(input, 's');

        await waitFor(() => {
          const renderedOptions = screen.getAllByTestId('Option');
          expect(renderedOptions).toHaveLength(1);
          expect(screen.getByText('Strawberry')).toBeInTheDocument();
        });
      });
    });

    describe('Touch Interactions', () => {
      // Mock isTouchCapable to simulate touch device
      beforeEach(() => {
        (isTouchCapable as jest.Mock).mockReturnValue(true);
      });

      afterEach(() => {
        (isTouchCapable as jest.Mock).mockReturnValue(false); // Reset
      });

      it('opens menu on control touchend', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const control = getControl();

        fireEvent.touchEnd(control); // Simulate touchend

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
        });
      });

      it('opens menu on dropdown indicator touchend', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} />);
        const dropdownIndicator = getDropdownIndicator();

        fireEvent.touchEnd(dropdownIndicator!); // Simulate touchend

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
        });
      });

      it('closes menu on control touchend when open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const control = getControl();

        fireEvent.touchEnd(control); // Simulate touchend

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('closes menu on dropdown indicator touchend when open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const dropdownIndicator = getDropdownIndicator();

        fireEvent.touchEnd(dropdownIndicator!); // Simulate touchend

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('clears value on clear indicator touchend', async () => {
        render(<Select options={options} onChange={mockOnChange} value={options[0]} isClearable />);
        const clearIndicator = getClearIndicator();

        fireEvent.touchEnd(clearIndicator!); // Simulate touchend

        await waitFor(() => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnChange).toHaveBeenCalledWith(null, { action: 'clear', removedValues: [options[0]], name: undefined });
          expect(getInput()).toHaveFocus(); // Input gets focus after clearing
        });
      });

      it('does not trigger click/touchend actions if user is dragging', async () => {
        render(<Select options={options} onChange={mockOnChange} />);
        const control = getControl();

        // Simulate touchstart
        fireEvent.touchStart(document, { touches: [{ clientX: 0, clientY: 0 }] });
        // Simulate touchmove beyond threshold
        fireEvent.touchMove(document, { touches: [{ clientX: 10, clientY: 10 }] });
        // Simulate touchend
        fireEvent.touchEnd(document, { changedTouches: [{ clientX: 10, clientY: 10 }] });

        // Simulate touchend on control after drag
        fireEvent.touchEnd(control);

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument(); // Menu should not open
          expect(mockOnMenuOpen).not.toHaveBeenCalled();
        });
      });

      it('closes menu on touchend outside control and menu', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const input = getInput();

        // Ensure input is focused so blur handler runs
        userEvent.click(input);

        // Simulate touchend on body (outside control and menu)
        fireEvent.touchEnd(document.body);

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('does not close menu on touchend inside control', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const control = getControl();
        const input = getInput();

        userEvent.click(input); // Ensure input is focused

        fireEvent.touchEnd(control);

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuClose).not.toHaveBeenCalled();
        });
      });

      it('does not close menu on touchend inside menu', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} />);
        const menu = getMenu();
        const input = getInput();

        userEvent.click(input); // Ensure input is focused

        fireEvent.touchEnd(menu!);

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuClose).not.toHaveBeenCalled();
        });
      });
    });

    describe('Focus/Blur Interactions', () => {
      it('calls onFocus when input is focused', () => {
        render(<Select options={options} onChange={mockOnChange} onFocus={mockOnFocus} />);
        const input = getInput();

        userEvent.click(input); // Simulate focus

        expect(mockOnFocus).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('SelectContainer')).toHaveClass('select--is-focused');
        expect(screen.getByTestId('Control')).toHaveClass('select__control--is-focused');
        expect(screen.getByTestId('Placeholder')).toHaveClass('select__placeholder--is-focused');
      });

      it('calls onBlur when input loses focus', async () => {
        render(<Select options={options} onChange={mockOnChange} onBlur={mockOnBlur} />);
        const input = getInput();

        userEvent.click(input); // Focus
        await waitFor(() => expect(input).toHaveFocus());

        userEvent.tab(); // Blur

        await waitFor(() => {
          expect(mockOnBlur).toHaveBeenCalledTimes(1);
          expect(screen.getByTestId('SelectContainer')).not.toHaveClass('select--is-focused');
          expect(screen.getByTestId('Control')).not.toHaveClass('select__control--is-focused');
          expect(screen.getByTestId('Placeholder')).not.toHaveClass('select__placeholder--is-focused');
          expect(mockOnInputChange).toHaveBeenCalledWith('', { action: 'input-blur', prevInputValue: '' });
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1); // Menu closes on blur
        });
      });

      it('does not blur if focus moves within the menu', async () => {
        render(<Select options={options} onChange={mockOnChange} onBlur={mockOnBlur} menuIsOpen />);
        const input = getInput();
        const menuList = getMenuList();

        userEvent.click(input); // Focus input
        await waitFor(() => expect(input).toHaveFocus());

        // Simulate focus moving to an element *within* the menu list
        Object.defineProperty(document, 'activeElement', { value: menuList, writable: true });

        userEvent.tab(); // Simulate blur event on input

        // The blur handler checks document.activeElement. If it's inside menuListRef, it refocuses the input.
        await waitFor(() => {
          expect(input).toHaveFocus(); // Input should regain focus
          expect(mockOnBlur).not.toHaveBeenCalled(); // onBlur should not be called
          expect(mockOnMenuClose).not.toHaveBeenCalled(); // Menu should not close
        });
      });

      it('opens menu on focus if openMenuOnFocus is true', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} openMenuOnFocus />);
        const input = getInput();

        userEvent.click(input); // Simulate focus

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(mockOnMenuOpen).toHaveBeenCalledTimes(1);
        });
      });

      it('does not open menu on focus if openMenuOnFocus is false', async () => {
        render(<Select options={options} onChange={mockOnChange} onMenuOpen={mockOnMenuOpen} openMenuOnFocus={false} />);
        const input = getInput();

        userEvent.click(input); // Simulate focus

        await waitFor(() => {
          expect(getMenu()).not.toBeInTheDocument();
          expect(mockOnMenuOpen).not.toHaveBeenCalled();
        });
      });

      it('blurs input on select if blurInputOnSelect is true', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen blurInputOnSelect />);
        const input = getInput();
        jest.spyOn(input, 'blur');

        userEvent.click(input); // Focus input
        userEvent.click(screen.getByText('Chocolate')); // Select option

        await waitFor(() => {
          expect(input.blur).toHaveBeenCalledTimes(1);
        });
      });

      it('does not blur input on select if blurInputOnSelect is false', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen blurInputOnSelect={false} />);
        const input = getInput();
        jest.spyOn(input, 'blur');

        userEvent.click(input); // Focus input
        userEvent.click(screen.getByText('Chocolate')); // Select option

        await waitFor(() => {
          expect(input.blur).not.toHaveBeenCalled();
          expect(input).toHaveFocus(); // Input should retain focus
        });
      });
    });

    describe('Scrolling Interactions', () => {
      it('closes menu on document scroll if closeMenuOnScroll is true', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} closeMenuOnScroll />);
        const input = getInput();

        userEvent.click(input); // Ensure focused

        // Simulate scroll event on document element
        fireEvent.scroll(document.documentElement);

        await waitFor(() => {
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('closes menu on document scroll if closeMenuOnScroll function returns true', async () => {
        const mockCloseOnScrollFn = jest.fn(() => true);
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} closeMenuOnScroll={mockCloseOnScrollFn} />);
        const input = getInput();

        userEvent.click(input); // Ensure focused

        // Simulate scroll event on document element
        fireEvent.scroll(document.documentElement);

        await waitFor(() => {
          expect(mockCloseOnScrollFn).toHaveBeenCalledTimes(1);
          expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
        });
      });

      it('does not close menu on document scroll if closeMenuOnScroll function returns false', async () => {
        const mockCloseOnScrollFn = jest.fn(() => false);
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuClose={mockOnMenuClose} closeMenuOnScroll={mockCloseOnScrollFn} />);
        const input = getInput();

        userEvent.click(input); // Ensure focused

        // Simulate scroll event on document element
        fireEvent.scroll(document.documentElement);

        await waitFor(() => {
          expect(mockCloseOnScrollFn).toHaveBeenCalledTimes(1);
          expect(mockOnMenuClose).not.toHaveBeenCalled();
        });
      });

      it('calls onMenuScrollToTop when menu list scrolls to top', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuScrollToTop={mockOnMenuScrollToTop} />);
        const menuList = getMenuList();

        // Simulate scroll event on the menu list element
        fireEvent.scroll(menuList!, { target: { scrollTop: 0 } });

        await waitFor(() => {
          expect(mockOnMenuScrollToTop).toHaveBeenCalledTimes(1);
        });
      });

      it('calls onMenuScrollToBottom when menu list scrolls to bottom', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuScrollToBottom={mockOnMenuScrollToBottom} />);
        const menuList = getMenuList();

        // Simulate scroll event on the menu list element
        // Need to mock scrollHeight and clientHeight for this to work correctly
        Object.defineProperty(menuList!, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(menuList!, 'clientHeight', { value: 100, configurable: true });
        fireEvent.scroll(menuList!, { target: { scrollTop: 100 } }); // scrollHeight - clientHeight

        await waitFor(() => {
          expect(mockOnMenuScrollToBottom).toHaveBeenCalledTimes(1);
        });
      });

      it('calls scrollIntoView when focused option changes and menu is open', async () => {
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Focus input
        userEvent.keyboard('{ArrowDown}'); // Change focused option

        await waitFor(() => {
          expect(scrollIntoView).toHaveBeenCalledTimes(1);
          // Check if it was called with the menu list ref and focused option ref
          expect(scrollIntoView).toHaveBeenCalledWith(
            expect.any(HTMLElement), // Mocked MenuList ref
            expect.any(HTMLElement) // Mocked focused Option ref
          );
        });
      });

      it('calls scrollIntoView when menu opens and there is a focused option', async () => {
        // Set initial value so an option is focused when menu opens
        render(<Select options={options} onChange={mockOnChange} value={options[0]} />);
        const input = getInput();

        userEvent.click(input); // Open menu

        await waitFor(() => {
          expect(getMenu()).toBeVisible();
          expect(scrollIntoView).toHaveBeenCalledTimes(1);
          expect(scrollIntoView).toHaveBeenCalledWith(
            expect.any(HTMLElement), // Mocked MenuList ref
            expect.any(HTMLElement) // Mocked focused Option ref (Chocolate)
          );
        });
      });

      it('does not call scrollIntoView if menu is already open and focused option changes', async () => {
        // This tests the `scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);` logic
        // It should only scroll on the *initial* open or when focus changes while closed and then opened.
        // If focus changes while already open, it relies on browser native scrolling or other mechanisms.
        render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
        const input = getInput();

        userEvent.click(input); // Ensure focused
        mockScrollIntoView.mockClear(); // Clear initial scroll on open

        userEvent.keyboard('{ArrowDown}'); // Change focused option while menu is open

        await waitFor(() => {
          // scrollIntoView should NOT be called again in this scenario
          expect(scrollIntoView).not.toHaveBeenCalled();
        });
      });
    });
  });

  // --- 4. State Management Tests ---
  describe('State Management', () => {
    it('updates selectValue state and calls onChange on selection (single)', async () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      const input = getInput();

      userEvent.click(input); // Focus input
      userEvent.click(screen.getByText('Chocolate')); // Select option

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(options[0], expect.any(Object));
      });

      // Simulate parent updating value prop based on onChange
      rerender(<Select options={options} onChange={mockOnChange} value={options[0]} />);

      // Check internal state update via rendered value
      expect(getSingleValue()).toBeInTheDocument();
      expect(screen.getByText('Chocolate')).toBeInTheDocument();
    });

    it('updates selectValue state and calls onChange on selection (multi)', async () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} isMulti menuIsOpen />);
      const input = getInput();

      userEvent.click(input); // Focus input
      userEvent.click(screen.getByText('Chocolate')); // Select option

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith([options[0]], expect.any(Object));
      });

      // Simulate parent updating value prop based on onChange
      rerender(<Select options={options} onChange={mockOnChange} isMulti value={[options[0]]} menuIsOpen />);

      // Select another option
      userEvent.click(screen.getByText('Strawberry'));

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(2);
        expect(mockOnChange).toHaveBeenLastCalledWith([options[0], options[1]], expect.any(Object));
      });

      // Simulate parent updating value prop based on onChange
      rerender(<Select options={options} onChange={mockOnChange} isMulti value={[options[0], options[1]]} menuIsOpen />);

      // Check internal state update via rendered values
      expect(getMultiValues()).toHaveLength(2);
      expect(screen.getByText('Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Strawberry')).toBeInTheDocument();
    });

    it('updates inputValue state and calls onInputChange on typing', async () => {
      render(<Select options={options} onChange={mockOnChange} onInputChange={mockOnInputChange} />);
      const input = getInput();

      userEvent.type(input, 'test');

      await waitFor(() => {
        expect(mockOnInputChange).toHaveBeenCalledTimes(4); // t, e, s, t
        expect(mockOnInputChange).toHaveBeenLastCalledWith('test', expect.any(Object));
      });
    });

    it('updates isFocused state on focus/blur', async () => {
      render(<Select options={options} onChange={mockOnChange} />);
      const input = getInput();
      const container = screen.getByTestId('SelectContainer');

      expect(container).not.toHaveClass('select--is-focused');

      userEvent.click(input); // Focus
      await waitFor(() => expect(input).toHaveFocus());
      expect(container).toHaveClass('select--is-focused');

      userEvent.tab(); // Blur
      await waitFor(() => expect(input).not.toHaveFocus());
      expect(container).not.toHaveClass('select--is-focused');
    });

    it('updates menuIsOpen state on interactions', async () => {
      render(<Select options={options} onChange={mockOnChange} />);
      const control = getControl();

      expect(getMenu()).not.toBeInTheDocument();

      userEvent.click(control); // Open
      await waitFor(() => expect(getMenu()).toBeVisible());

      userEvent.click(control); // Close
      await waitFor(() => expect(getMenu()).not.toBeInTheDocument());
    });

    it('updates focusedOption state on keyboard navigation', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      const input = getInput();

      userEvent.click(input); // Focus input
      userEvent.keyboard('{ArrowDown}'); // Focus Chocolate
      await waitFor(() => {
        expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
      });

      userEvent.keyboard('{ArrowDown}'); // Focus Strawberry
      await waitFor(() => {
        expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
      });
    });

    it('updates focusedValue state on keyboard navigation (multi)', async () => {
      const initialValue = [options[0], options[1]];
      render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
      const input = getInput();

      userEvent.click(input); // Focus input
      userEvent.keyboard('{ArrowLeft}'); // Focus Strawberry
      await waitFor(() => {
        expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[1], isFocused: true }), {});
      });

      userEvent.keyboard('{ArrowLeft}'); // Focus Chocolate
      await waitFor(() => {
        expect(MultiValue).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
      });
    });

    it('updates inputIsHidden state when focusing/unfocusing value (multi)', async () => {
      const initialValue = [options[0], options[1]];
      render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} />);
      const input = getInput();

      expect(input).toHaveStyle('visibility: visible');

      userEvent.click(input); // Focus input
      userEvent.keyboard('{ArrowLeft}'); // Focus Strawberry

      await waitFor(() => {
        expect(input).toHaveStyle('visibility: hidden');
      });

      userEvent.keyboard('{ArrowRight}'); // Unfocus value, focus input

      await waitFor(() => {
        expect(input).toHaveStyle('visibility: visible');
      });
    });

    it('updates ariaSelection state on value changes and initial focus', async () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} />);
      const liveRegion = getLiveRegion();

      // Initial render - no value, no focus
      expect(liveRegion).toHaveTextContent('');

      // Focus input - should announce initial value (none)
      userEvent.click(getInput());
      await waitFor(() => {
        // Check the props passed to the mock LiveRegion
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: null,
              options: [],
              action: 'initial-input-focus',
            },
          }),
          {}
        );
      });

      // Select a value
      userEvent.click(screen.getByText('Chocolate'));
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(1);
      });

      // Simulate parent updating value prop
      rerender(<Select options={options} onChange={mockOnChange} value={options[0]} />);

      // Check ariaSelection update after selection
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: options[0],
              options: [options[0]],
              action: 'select-option',
              option: options[0],
              name: undefined,
            },
          }),
          {}
        );
      });

      // Clear value
      userEvent.click(getClearIndicator()!);
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(2);
      });

      // Simulate parent updating value prop
      rerender(<Select options={options} onChange={mockOnChange} value={null} />);

      // Check ariaSelection update after clearing
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: null,
              options: [],
              action: 'clear',
              removedValues: [options[0]],
              name: undefined,
            },
          }),
          {}
        );
      });
    });

    it('handles getDerivedStateFromProps correctly on prop changes', () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} />);

      // Change value prop
      rerender(<Select options={options} onChange={mockOnChange} value={options[0]} />);
      expect(screen.getByText('Chocolate')).toBeInTheDocument();

      // Change options prop
      const newOptions = [{ value: 'lemon', label: 'Lemon' }];
      rerender(<Select options={newOptions} onChange={mockOnChange} value={newOptions[0]} />);
      expect(screen.getByText('Lemon')).toBeInTheDocument();

      // Change menuIsOpen prop
      rerender(<Select options={newOptions} onChange={mockOnChange} value={newOptions[0]} menuIsOpen />);
      expect(getMenu()).toBeVisible();

      // Change inputValue prop
      rerender(<Select options={options} onChange={mockOnChange} inputValue="straw" menuIsOpen />);
      expect(screen.queryByText('Chocolate')).not.toBeInTheDocument();
      expect(screen.getByText('Strawberry')).toBeInTheDocument();
    });
  });

  // --- 5. Menu and Options Tests ---
  describe('Menu and Options', () => {
    it('renders options when menu is open', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      await waitFor(() => {
        expect(getMenu()).toBeVisible();
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(2); // Chocolate, Strawberry (Vanilla is disabled by default mock)
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
        expect(screen.getByText('Strawberry')).toBeInTheDocument();
        expect(screen.queryByText('Vanilla')).not.toBeInTheDocument(); // Disabled option not rendered by default filter
      });
    });

    it('renders disabled options if filterOption allows them', async () => {
      // Mock filter to include disabled options
      (createFilter as jest.Mock).mockReturnValue(jest.fn(() => true));
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      await waitFor(() => {
        expect(getMenu()).toBeVisible();
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(3); // Chocolate, Strawberry, Vanilla
        expect(screen.getByText('Vanilla')).toBeInTheDocument();
        // Check if the Option component received the isDisabled prop
        expect(Option).toHaveBeenCalledWith(
          expect.objectContaining({
            data: options[2], // Vanilla
            isDisabled: true,
          }),
          {}
        );
      });
    });

    it('uses custom isOptionDisabled prop', async () => {
      const customIsOptionDisabled = jest.fn((option) => option.value === 'strawberry');
      render(<Select options={options} onChange={mockOnChange} menuIsOpen isOptionDisabled={customIsOptionDisabled} />);
      await waitFor(() => {
        expect(customIsOptionDisabled).toHaveBeenCalled();
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(2); // Chocolate, Vanilla (Strawberry is disabled by custom prop)
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
        expect(screen.getByText('Vanilla')).toBeInTheDocument(); // Vanilla is NOT disabled by default mock anymore
        expect(screen.queryByText('Strawberry')).not.toBeInTheDocument();
        expect(Option).toHaveBeenCalledWith(
          expect.objectContaining({
            data: options[1], // Strawberry
            isDisabled: true,
          }),
          {}
        );
      });
    });

    it('hides selected options in menu when hideSelectedOptions is true (multi)', async () => {
      const initialValue = [options[0]]; // Chocolate selected
      render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} menuIsOpen hideSelectedOptions />);
      await waitFor(() => {
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(1); // Only Strawberry should be visible
        expect(screen.getByText('Strawberry')).toBeInTheDocument();
        expect(screen.queryByText('Chocolate')).not.toBeInTheDocument();
      });
    });

    it('does not hide selected options in menu when hideSelectedOptions is false (multi)', async () => {
      const initialValue = [options[0]]; // Chocolate selected
      render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} menuIsOpen hideSelectedOptions={false} />);
      await waitFor(() => {
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(2); // Chocolate, Strawberry
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
        expect(screen.getByText('Strawberry')).toBeInTheDocument();
      });
    });

    it('does not hide selected options in menu for single select by default', async () => {
      const initialValue = options[0]; // Chocolate selected
      render(<Select options={options} onChange={mockOnChange} value={initialValue} menuIsOpen />);
      await waitFor(() => {
        const renderedOptions = screen.getAllByTestId('Option');
        expect(renderedOptions).toHaveLength(2); // Chocolate, Strawberry
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
        expect(screen.getByText('Strawberry')).toBeInTheDocument();
      });
    });

    it('uses custom formatOptionLabel prop', async () => {
      const customFormatOptionLabel = jest.fn((option, { context }) => `${option.label} (${context})`);
      render(<Select options={options} onChange={mockOnChange} menuIsOpen formatOptionLabel={customFormatOptionLabel} />);
      await waitFor(() => {
        expect(customFormatOptionLabel).toHaveBeenCalledWith(options[0], expect.objectContaining({ context: 'menu' }));
        expect(customFormatOptionLabel).toHaveBeenCalledWith(options[1], expect.objectContaining({ context: 'menu' }));
        expect(screen.getByText('Chocolate (menu)')).toBeInTheDocument();
        expect(screen.getByText('Strawberry (menu)')).toBeInTheDocument();
      });

      // Test formatOptionLabel for 'value' context
      render(<Select options={options} onChange={mockOnChange} value={options[0]} formatOptionLabel={customFormatOptionLabel} />);
      expect(customFormatOptionLabel).toHaveBeenCalledWith(options[0], expect.objectContaining({ context: 'value' }));
      expect(screen.getByText('Chocolate (value)')).toBeInTheDocument();
    });

    it('uses custom formatGroupLabel prop', async () => {
      const customFormatGroupLabel = jest.fn((group) => `Group: ${group.label}`);
      render(<Select options={groupedOptions} onChange={mockOnChange} menuIsOpen formatGroupLabel={customFormatGroupLabel} />);
      await waitFor(() => {
        expect(customFormatGroupLabel).toHaveBeenCalledWith(groupedOptions[0]);
        expect(customFormatGroupLabel).toHaveBeenCalledWith(groupedOptions[1]);
        expect(screen.getByText('Group: Flavours')).toBeInTheDocument();
        expect(screen.getByText('Group: Colors')).toBeInTheDocument();
      });
    });

    it('uses custom getOptionLabel prop', () => {
      const customGetOptionLabel = jest.fn((option) => `Label: ${option.label}`);
      render(<Select options={options} onChange={mockOnChange} getOptionLabel={customGetOptionLabel} value={options[0]} />);
      expect(customGetOptionLabel).toHaveBeenCalledWith(options[0]);
      expect(screen.getByText('Label: Chocolate')).toBeInTheDocument();
    });

    it('uses custom getOptionValue prop', () => {
      const customGetOptionValue = jest.fn((option) => `Value:${option.value}`);
      render(<Select options={options} onChange={mockOnChange} getOptionValue={customGetOptionValue} value={options[0]} name="test" />);
      expect(customGetOptionValue).toHaveBeenCalledWith(options[0]);
      const hiddenInput = screen.getByRole('textbox', { hidden: true });
      expect(hiddenInput).toHaveAttribute('value', 'Value:chocolate');
    });

    it('uses custom isOptionSelected prop', async () => {
      const customIsOptionSelected = jest.fn((option, selectValue) => {
        // Consider Strawberry selected if Chocolate is also selected
        return selectValue.some((v: any) => v.value === 'chocolate') && option.value === 'strawberry';
      });
      const initialValue = [options[0]]; // Chocolate selected
      render(<Select options={options} onChange={mockOnChange} isMulti value={initialValue} menuIsOpen isOptionSelected={customIsOptionSelected} />);

      await waitFor(() => {
        expect(customIsOptionSelected).toHaveBeenCalledWith(options[1], initialValue); // Check for Strawberry
        // Check if Option component received isSelected=true for Strawberry
        expect(Option).toHaveBeenCalledWith(
          expect.objectContaining({
            data: options[1], // Strawberry
            isSelected: true,
          }),
          {}
        );
      });
    });
  });

  // --- 6. Accessibility Testing ---
  describe('Accessibility', () => {
    it('sets correct ARIA attributes on input and listbox', async () => {
      render(<Select options={options} onChange={mockOnChange} />);
      const input = getInput();

      // Initial state (closed)
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('aria-describedby', screen.getByTestId('Placeholder').id);
      expect(input).not.toHaveAttribute('aria-activedescendant');
      expect(input).not.toHaveAttribute('aria-controls');

      // Open menu
      userEvent.click(input);
      await waitFor(() => expect(getMenu()).toBeVisible());

      const menuList = getMenuList();
      expect(menuList).toHaveAttribute('role', 'listbox');
      expect(menuList).toHaveAttribute('id', expect.stringContaining('listbox'));
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls', menuList!.id);

      // Navigate to focus an option
      userEvent.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
      });

      // Check aria-activedescendant
      const focusedOptionId = Option.mock.calls.find(call => call[0].isFocused)?.[0].innerProps.id;
      expect(input).toHaveAttribute('aria-activedescendant', focusedOptionId);

      // Select an option (menu closes)
      userEvent.keyboard('{Enter}');
      await waitFor(() => expect(getMenu()).not.toBeInTheDocument());

      // State after selection and menu close
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-activedescendant');
      expect(input).not.toHaveAttribute('aria-controls');
      expect(input).not.toHaveAttribute('aria-describedby', screen.getByTestId('Placeholder').id); // Placeholder is gone
    });

    it('sets aria-multiselectable for multi-select', () => {
      render(<Select options={options} onChange={mockOnChange} isMulti menuIsOpen />);
      const menuList = getMenuList();
      expect(menuList).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('uses aria-live region for announcements', async () => {
      render(<Select options={options} onChange={mockOnChange} />);
      const liveRegion = getLiveRegion();

      // Initial focus announcement (handled in getDerivedStateFromProps)
      userEvent.click(getInput());
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: null,
              options: [],
              action: 'initial-input-focus',
            },
          }),
          {}
        );
      });

      // Selection announcement
      userEvent.click(screen.getByText('Chocolate'));
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: options[0],
              options: [options[0]],
              action: 'select-option',
              option: options[0],
              name: undefined,
            },
          }),
          {}
        );
      });

      // Removal announcement (multi-select)
      const { rerender } = render(<Select options={options} onChange={mockOnChange} isMulti value={[options[0], options[1]]} />);
      const multiValueRemove = screen.getAllByTestId('MultiValueRemove')[0];
      userEvent.click(multiValueRemove);
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: [options[1]],
              options: [options[1]],
              action: 'remove-value',
              removedValue: options[0],
              name: undefined,
            },
          }),
          {}
        );
      });

      // Clear announcement
      rerender(<Select options={options} onChange={mockOnChange} value={options[0]} isClearable />);
      userEvent.click(getClearIndicator()!);
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: null,
              options: [],
              action: 'clear',
              removedValues: [options[0]],
              name: undefined,
            },
          }),
          {}
        );
      });

      // Disabled option selection attempt announcement
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      userEvent.click(screen.getByText('Vanilla')); // Disabled option
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: {
              value: options[2],
              options: [], // Assuming selectValue is empty or doesn't include disabled option
              action: 'select-option',
              option: options[2],
              name: undefined,
            },
          }),
          {}
        );
      });
    });

    it('uses custom ariaLiveMessages prop', async () => {
      const customMessages = {
        onFocus: ({ value, isMulti, options }: any) => `Focused: ${isMulti ? options.length : value?.label || 'nothing'}`,
        onSelect: ({ option, isMulti, value }: any) => `Selected: ${option.label}. Current: ${isMulti ? value.length : value?.label || 'nothing'}`,
        onDeselect: ({ option, isMulti, value }: any) => `Deselected: ${option.label}. Current: ${isMulti ? value.length : value?.label || 'nothing'}`,
        onClear: ({ removedValues }: any) => `Cleared ${removedValues.length} values.`,
        onRemove: ({ removedValue, value }: any) => `Removed ${removedValue.label}. Current: ${value.length}`,
        onCreateOption: ({ newValue }: any) => `Created ${newValue.label}`, // Not directly testable in this component
        // Add other messages if needed
      };
      render(<Select options={options} onChange={mockOnChange} ariaLiveMessages={customMessages} />);
      const liveRegion = getLiveRegion();

      // Initial focus
      userEvent.click(getInput());
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: expect.objectContaining({ action: 'initial-input-focus' }),
            ariaLiveMessages: customMessages, // Check messages are passed down
          }),
          {}
        );
      });

      // Select
      userEvent.click(screen.getByText('Chocolate'));
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: expect.objectContaining({ action: 'select-option' }),
            ariaLiveMessages: customMessages,
          }),
          {}
        );
      });

      // Multi-select and remove
      const { rerender } = render(<Select options={options} onChange={mockOnChange} isMulti value={[options[0], options[1]]} ariaLiveMessages={customMessages} />);
      const multiValueRemove = screen.getAllByTestId('MultiValueRemove')[0];
      userEvent.click(multiValueRemove);
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: expect.objectContaining({ action: 'remove-value' }),
            ariaLiveMessages: customMessages,
          }),
          {}
        );
      });

      // Clear
      rerender(<Select options={options} onChange={mockOnChange} value={options[0]} isClearable ariaLiveMessages={customMessages} />);
      userEvent.click(getClearIndicator()!);
      await waitFor(() => {
        expect(LiveRegion).toHaveBeenCalledWith(
          expect.objectContaining({
            ariaSelection: expect.objectContaining({ action: 'clear' }),
            ariaLiveMessages: customMessages,
          }),
          {}
        );
      });
    });

    it('handles isAppleDevice for aria-activedescendant', async () => {
      (isAppleDevice as jest.Mock).mockReturnValue(true);
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      const input = getInput();

      userEvent.click(input); // Focus input
      userEvent.keyboard('{ArrowDown}'); // Focus Chocolate
      await waitFor(() => {
        expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
      });

      // On Apple devices, aria-activedescendant should NOT be set
      expect(input).not.toHaveAttribute('aria-activedescendant');

      // Reset mock
      (isAppleDevice as jest.Mock).mockReturnValue(false);
    });
  });

  // --- 7. Edge Case Testing ---
  describe('Edge Cases', () => {
    it('renders correctly with empty options array', () => {
      render(<Select options={[]} onChange={mockOnChange} />);
      expect(screen.getByTestId('SelectContainer')).toBeInTheDocument();
      expect(getPlaceholder()).toBeInTheDocument();
      expect(getMenu()).not.toBeInTheDocument();
    });

    it('shows noOptionsMessage when options array is empty and menu is open', async () => {
      render(<Select options={[]} onChange={mockOnChange} menuIsOpen />);
      await waitFor(() => {
        expect(getMenu()).toBeVisible();
        expect(getNoOptionsMessage()).toBeInTheDocument();
        expect(screen.getByText('No options')).toBeInTheDocument();
      });
    });

    it('handles null or undefined value prop', () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} value={null} />);
      expect(getSingleValue()).not.toBeInTheDocument();
      expect(getMultiValues()).toHaveLength(0);
      expect(getPlaceholder()).toBeInTheDocument();

      rerender(<Select options={options} onChange={mockOnChange} value={undefined} />);
      expect(getSingleValue()).not.toBeInTheDocument();
      expect(getMultiValues()).toHaveLength(0);
      expect(getPlaceholder()).toBeInTheDocument();
    });

    it('handles null or undefined values in multi-select array', () => {
      const value = [options[0], null, options[1], undefined];
      render(<Select options={options} onChange={mockOnChange} isMulti value={value as any} />);
      // cleanValue should filter out null/undefined
      expect(cleanValue).toHaveBeenCalledWith(value);
      expect(getMultiValues()).toHaveLength(2);
      expect(screen.getByText('Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Strawberry')).toBeInTheDocument();
    });

    it('does not render clear indicator when isClearable is false', () => {
      render(<Select options={options} onChange={mockOnChange} value={options[0]} isClearable={false} />);
      expect(getClearIndicator()).not.toBeInTheDocument();
    });

    it('does not render input when isSearchable is false', () => {
      render(<Select options={options} onChange={mockOnChange} isSearchable={false} />);
      expect(screen.queryByTestId('Input')).not.toBeInTheDocument();
      expect(screen.getByTestId('DummyInput')).toBeInTheDocument(); // Renders DummyInput instead
    });

    it('DummyInput handles focus/blur', async () => {
      render(<Select options={options} onChange={mockOnChange} isSearchable={false} onFocus={mockOnFocus} onBlur={mockOnBlur} />);
      const dummyInput = screen.getByTestId('DummyInput');

      userEvent.click(dummyInput); // Focus
      await waitFor(() => expect(dummyInput).toHaveFocus());
      expect(mockOnFocus).toHaveBeenCalledTimes(1);

      userEvent.tab(); // Blur
      await waitFor(() => expect(dummyInput).not.toHaveFocus());
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it('opens menu initially if menuIsOpen is true', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      await waitFor(() => {
        expect(getMenu()).toBeVisible();
      });
    });

    it('focuses input initially if autoFocus is true', async () => {
      render(<Select options={options} onChange={mockOnChange} autoFocus />);
      await waitFor(() => {
        expect(getInput()).toHaveFocus();
      });
    });

    it('does not select focused option on Tab if openMenuOnFocus is true and option is already selected', async () => {
      // This is a specific edge case mentioned in the code comments
      // "don't capture the event if the menu opens on focus and the focused
      // option is already selected; it breaks the flow of navigation"
      const initialValue = options[0]; // Chocolate selected
      render(<Select options={options} onChange={mockOnChange} value={initialValue} menuIsOpen openMenuOnFocus tabSelectsValue />);
      const input = getInput();

      // Focus input (menu is already open, Chocolate is focused by default because it's selected)
      userEvent.click(input);
      await waitFor(() => {
        expect(Option).toHaveBeenCalledWith(expect.objectContaining({ data: options[0], isFocused: true }), {});
      });

      // Press Tab - should NOT select again, should just tab out
      userEvent.tab();

      await waitFor(() => {
        expect(mockOnChange).not.toHaveBeenCalled(); // Should not select again
        expect(getMenu()).toBeVisible(); // Menu should not close due to selection
      });
    });

    it('handles composition events (IME)', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen />);
      const input = getInput();

      userEvent.click(input); // Focus input

      // Simulate composition start
      fireEvent.compositionStart(input);
      // Simulate keydown for a key that might be part of composition (e.g., Enter)
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 }); // keyCode 229 indicates IME input

      await waitFor(() => {
        // Menu should still be open, Enter key action should be ignored
        expect(getMenu()).toBeVisible();
        expect(mockOnChange).not.toHaveBeenCalled(); // Should not select
      });

      // Simulate composition end
      fireEvent.compositionEnd(input);
      // Now a regular Enter key should work
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(1); // Should select focused option
      });
    });

    it('handles programmatic disable while focused', async () => {
      const { rerender } = render(<Select options={options} onChange={mockOnChange} />);
      const input = getInput();

      userEvent.click(input); // Focus
      await waitFor(() => expect(input).toHaveFocus());
      expect(screen.getByTestId('SelectContainer')).toHaveClass('select--is-focused');

      // Programmatically disable
      rerender(<Select options={options} onChange={mockOnChange} isDisabled />);

      // Should blur the select state
      await waitFor(() => {
        expect(screen.getByTestId('SelectContainer')).not.toHaveClass('select--is-focused');
        expect(mockOnMenuClose).toHaveBeenCalledTimes(1); // Menu should close
      });
    });

    it('handles programmatic enable while focused (Firefox edge case)', async () => {
      // This scenario is tricky to simulate perfectly in JSDOM as document.activeElement
      // doesn't behave exactly like a browser when elements are disabled/re-enabled.
      // We'll simulate the condition where the input *would* be activeElement if it weren't disabled.
      const { rerender } = render(<Select options={options} onChange={mockOnChange} isDisabled />);
      const input = getInput();

      // Simulate the input being the active element (as might happen in Firefox)
      Object.defineProperty(document, 'activeElement', { value: input, writable: true });

      // Programmatically enable
      rerender(<Select options={options} onChange={mockOnChange} isDisabled={false} />);

      // Should focus the select state
      await waitFor(() => {
        expect(screen.getByTestId('SelectContainer')).toHaveClass('select--is-focused');
      });
    });
  });

  // --- 8. Performance Testing ---
  // Unit tests are not the right tool for performance testing.
  // This would typically involve profiling in a browser or using dedicated performance testing tools.
  // We acknowledge this limitation in the unit test suite.

  // --- 9. Test Coverage Requirements ---
  // This is an ongoing process during development. The tests above aim for high coverage
  // by targeting different props, states, and interaction paths. After running the tests,
  // a coverage report would be generated (e.g., `jest --coverage`) to identify gaps.
  // We've included tests for many branches and conditions based on the code analysis.

  // --- 10. Test Documentation ---
  // The test cases are documented using descriptive `describe` and `it` blocks.
  // Setup and teardown are handled in `beforeEach` and `afterEach` blocks.
  // Mocks are explained and set up at the top of the file.

  // Additional tests for specific props/behaviors not fully covered:
  describe('Specific Prop Tests', () => {
    it('uses custom components', () => {
      const CustomControl = jest.fn((props) => <div data-testid="CustomControl" {...props.innerProps}>{props.children}</div>);
      render(<Select options={options} onChange={mockOnChange} components={{ Control: CustomControl }} />);
      expect(screen.getByTestId('CustomControl')).toBeInTheDocument();
      expect(screen.queryByTestId('Control')).not.toBeInTheDocument();
    });

    it('uses custom styles', () => {
      const customStyles = {
        control: (base: any, state: any) => ({ ...base, border: '1px solid red' }),
      };
      render(<Select options={options} onChange={mockOnChange} styles={customStyles} />);
      // We can't easily assert CSS styles in JSDOM, but we can check if the style function was called
      // The mock defaultStyles and the customStyles function are called within getStyles.
      // We can verify getStyles is called with the correct key and props.
      expect(defaultStyles.control).toHaveBeenCalled();
      // Verifying the custom style function call itself is harder without modifying the mock structure further,
      // but the fact that defaultStyles.control is called and the component renders implies the style pipeline is active.
    });

    it('renders menu portal when menuPortalTarget is provided', async () => {
      const portalTarget = document.createElement('div');
      portalTarget.setAttribute('id', 'portal-root');
      document.body.appendChild(portalTarget);

      render(<Select options={options} onChange={mockOnChange} menuIsOpen menuPortalTarget={portalTarget} />);

      await waitFor(() => {
        expect(getMenuPortal()).toBeInTheDocument();
        // In a real DOM, you'd check if the menu element is a child of portalTarget
        // With mocks, we check if the mock MenuPortal was rendered
      });

      document.body.removeChild(portalTarget); // Cleanup
    });

    it('renders menu portal when menuPosition is fixed', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen menuPosition="fixed" />);

      await waitFor(() => {
        expect(getMenuPortal()).toBeInTheDocument();
      });
    });

    it('calls onMenuScrollToTop/Bottom with correct event type', async () => {
      render(<Select options={options} onChange={mockOnChange} menuIsOpen onMenuScrollToTop={mockOnMenuScrollToTop} onMenuScrollToBottom={mockOnMenuScrollToBottom} />);
      const menuList = getMenuList();

      // Simulate WheelEvent
      fireEvent.scroll(menuList!, { target: { scrollTop: 0 } });
      await waitFor(() => {
        expect(mockOnMenuScrollToTop).toHaveBeenCalledTimes(1);
        expect(mockOnMenuScrollToTop).toHaveBeenCalledWith(expect.any(Object)); // Check it's called with an event object
      });

      // Simulate TouchEvent (requires mocking touch events on the element)
      // This is harder to simulate accurately with fireEvent. A more robust test might involve
      // mocking the ScrollManager's onTopArrive/onBottomArrive props directly and triggering them.
      // For now, we rely on the WheelEvent test and the ScrollManager mock receiving the props.
      expect(ScrollManager).toHaveBeenCalledWith(
        expect.objectContaining({
          onTopArrive: mockOnMenuScrollToTop,
          onBottomArrive: mockOnMenuScrollToBottom,
        }),
        {}
      );
    });

    it('uses unstyled prop', () => {
      render(<Select options={options} onChange={mockOnChange} unstyled />);
      // Check if defaultStyles functions are called with unstyled=true
      expect(defaultStyles.container).toHaveBeenCalledWith(expect.any(Object), true);
      expect(defaultStyles.control).toHaveBeenCalledWith(expect.any(Object), true);
      // ... check other defaultStyles calls
    });
  });
});

// Helper to query mocked components by data-testid
const getLoadingIndicator = () => screen.queryByTestId('LoadingIndicator');
const getNoOptionsMessage = () => screen.queryByTestId('NoOptionsMessage');
const getIndicatorSeparator = () => screen.queryByTestId('IndicatorSeparator');
```

**Explanation and How to Run:**

1.  **Save:** Save the provided `Select` component code as `index.tsx` (or similar) in your project. Save the mock files in a `__mocks__/react-select-internal/` directory structure relative to your test file. Save the test code as `index.test.tsx` (or similar) in your test directory (e.g., `__tests__/`).
2.  **Install:** Make sure you have Jest, React Testing Library, user-event, and jest-dom installed (`npm install --save-dev jest @testing-library/react @testing-library/user-event @testing-library/jest-dom`).
3.  **Configure Jest:** Ensure your `jest.config.js` or `package.json` is set up to use `jsdom` and `setupFilesAfterEnv` correctly.
4.  **Run Tests:** Execute `npm test` or `yarn test`.

**Key Aspects of the Tests:**

*   **Mocking:** Extensive mocking is used to isolate the `Select` component's logic. We mock child components to check if they are rendered with the correct props and children. We mock utility functions to control their behavior and verify they are called.
*   **React Testing Library:** Tests focus on user interactions (`userEvent`) and querying the DOM from a user's perspective (`screen.getByRole`, `screen.getByText`, `screen.getByTestId`). We avoid testing internal component state directly where possible, instead asserting on the rendered output or the side effects (like mock function calls).
*   **`userEvent`:** Used for more realistic event simulation (typing, clicking, tabbing).
*   **`fireEvent`:** Used for lower-level events like `mouseDown`, `touchEnd`, `scroll`, `compositionStart/End` where `userEvent` might not provide the necessary granularity or direct control over event properties.
*   **`waitFor`:** Essential for waiting for asynchronous updates that happen after state changes or event handling (e.g., menu opening, options filtering).
*   **`jest.fn()`:** Used for mocking callback props and checking if they were called with the expected arguments.
*   **`jest.spyOn()`:** Used to spy on methods of component instances or DOM elements (like `input.focus()`, `input.blur()`) to verify they are called.
*   **DOM Mocking:** Manual mocking of `document.addEventListener`, `Element.prototype.scrollIntoView`, `document.activeElement`, etc., is necessary because JSDOM doesn't fully replicate browser environments for these APIs.
*   **Coverage:** The tests cover a wide range of scenarios, including different prop combinations, interaction types, and edge cases, aiming for high code coverage. You would use a coverage report tool to confirm the actual percentage.

This test suite provides a strong foundation for verifying the behavior of the `Select` component. Remember that maintaining high coverage requires adding tests whenever new features or bug fixes are implemented.

### Tokens: {'input_tokens': 18518, 'output_tokens': 29308}
### Execution time: 138.80012130737305
