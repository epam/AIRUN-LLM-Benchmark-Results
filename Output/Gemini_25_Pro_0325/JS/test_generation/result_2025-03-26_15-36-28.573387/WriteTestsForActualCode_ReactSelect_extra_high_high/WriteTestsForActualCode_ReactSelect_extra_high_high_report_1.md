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
Okay, let's create a comprehensive suite of unit tests for the provided `Select` component using Jest and React Testing Library (RTL).

**1. Test Environment Setup**

First, ensure you have the necessary dependencies installed:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event react react-dom
# or
yarn add --dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event react react-dom
```

Configure Jest (e.g., in `jest.config.js` or `package.json`):

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Or wherever your setup file is
  moduleNameMapper: {
    // Add any necessary module mappings if you use aliases
  },
  coverageThreshold: { // Optional: Enforce coverage
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [ // Optional: Specify files to include in coverage
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}', // Often exclude barrel files
    '!src/types.ts', // Exclude type definitions
    // Add other exclusions as needed (e.g., stories, constants)
  ],
};
```

Create a setup file (e.g., `src/setupTests.ts`):

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock scrollIntoView as it doesn't exist in JSDOM
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock matchMedia (often used by libraries for responsive checks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (if needed by dependencies)
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock document event listeners globally if needed for specific tests,
// but often spying within tests is better.
// Example: jest.spyOn(document, 'addEventListener');
//          jest.spyOn(document, 'removeEventListener');

// Clean up after each test
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
  jest.clearAllMocks(); // Clear mocks to avoid interference between tests
});
```

**Mocking Utilities**

Since the component uses utility functions like `isTouchCapable`, `isMobileDevice`, `isAppleDevice`, we should mock them to control the test environment behavior.

```typescript
// src/Select/__mocks__/utils.ts (or wherever utils are located)
export const isTouchCapable = jest.fn(() => false);
export const isMobileDevice = jest.fn(() => false);
export const isDocumentElement = jest.fn((el) => el === document.documentElement || el === document.body);
export const scrollIntoView = jest.fn(); // Mock the imported one too if used directly
export const classNames = (...args: any[]) => args.filter(Boolean).join(' '); // Simple mock
export const cleanValue = (value: any) => Array.isArray(value) ? value : (value ? [value] : []);
export const noop = () => {};
export const notNullish = <T>(item: T | null | undefined): item is T => item != null;
export const valueTernary = <Option, IsMulti extends boolean>(
  isMulti: IsMulti,
  multiValue: any,
  singleValue: any
) => (isMulti ? multiValue : singleValue);
export const multiValueAsValue = <Option>(value: readonly Option[]) => value;
export const singleValueAsValue = <Option>(value: Option | null) => value;


// src/Select/__mocks__/accessibility/helpers.ts
export const isAppleDevice = jest.fn(() => false);

// In your test file, tell Jest to use these mocks:
jest.mock('../utils'); // Adjust path relative to test file
jest.mock('../accessibility/helpers'); // Adjust path relative to test file
```

**2. Unit Test File (`Select.test.tsx`)**

```typescript
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { defaultProps, Props } from '../index'; // Adjust the import path
import { GroupBase, OptionsOrGroups, PropsValue, OnChangeValue, ActionMeta } from '../types';

// Mock internal components if they become complex or have side effects not needed for Select's tests
// jest.mock('./components/Menu');
// jest.mock('./components/LiveRegion');

// --- Test Data ---
interface OptionType {
  value: string;
  label: string;
  isDisabled?: boolean;
}

const options: OptionType[] = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
  { value: 'four', label: 'Four (Disabled)', isDisabled: true },
];

const groupedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>> = [
  {
    label: 'Group 1',
    options: [options[0], options[1]],
  },
  {
    label: 'Group 2',
    options: [options[2], options[3]],
  },
];

// --- Helper Functions ---
type SelectProps<IsMulti extends boolean = false> = Partial<Props<OptionType, IsMulti, GroupBase<OptionType>>>;

const renderSelect = <IsMulti extends boolean = false>(props: SelectProps<IsMulti> = {}) => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const onInputChange = jest.fn();
  const onMenuOpen = jest.fn();
  const onMenuClose = jest.fn();
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  const onKeyDown = jest.fn();

  const mergedProps: Props<OptionType, IsMulti, GroupBase<OptionType>> = {
    // Provide defaults that are often needed
    instanceId: 'test-select', // Ensures stable IDs
    options: options,
    onChange: onChange,
    onInputChange: onInputChange,
    onMenuOpen: onMenuOpen,
    onMenuClose: onMenuClose,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyDown: onKeyDown,
    // Merge defaultProps and test-specific props
    ...defaultProps,
    ...props,
    // Ensure required props have values if not overridden
    isMulti: props.isMulti ?? (false as IsMulti),
    value: props.value ?? (props.isMulti ? [] : null),
  };

  const result = render(<Select {...mergedProps} />);

  const rerender = (newProps: SelectProps<IsMulti>) => {
    result.rerender(<Select {...{ ...mergedProps, ...newProps }} />);
  };

  const getControl = () => screen.getByRole('combobox').closest('.react-select__control')!;
  const getInput = () => screen.getByRole('combobox') as HTMLInputElement;
  const getMenu = () => screen.queryByRole('listbox');
  const getOptions = () => screen.queryAllByRole('option');
  const getOption = (label: string) => screen.queryByText(label)?.closest('[role="option"]');
  const getPlaceholder = () => screen.queryByText(defaultProps.placeholder as string);
  const getValueContainer = () => getControl()?.querySelector('.react-select__value-container');
  const getSingleValue = () => getValueContainer()?.querySelector('.react-select__single-value');
  const getMultiValues = () => getValueContainer()?.querySelectorAll('.react-select__multi-value');
  const getClearIndicator = () => getControl()?.querySelector('.react-select__clear-indicator');
  const getDropdownIndicator = () => getControl()?.querySelector('.react-select__dropdown-indicator');
  const getLoadingIndicator = () => getControl()?.querySelector('.react-select__loading-indicator');

  return {
    ...result,
    rerender,
    user,
    onChange,
    onInputChange,
    onMenuOpen,
    onMenuClose,
    onFocus,
    onBlur,
    onKeyDown,
    getControl,
    getInput,
    getMenu,
    getOptions,
    getOption,
    getPlaceholder,
    getValueContainer,
    getSingleValue,
    getMultiValues,
    getClearIndicator,
    getDropdownIndicator,
    getLoadingIndicator,
    props: mergedProps, // Expose merged props for assertions
  };
};

// --- Mocks Setup (within describe or beforeEach) ---
// (Moved mock imports to top level as per Jest best practices)

describe('<Select />', () => {
  // --- 2. Component Rendering Tests ---
  describe('Rendering', () => {
    it('renders with default props', () => {
      const { getControl, getInput, getPlaceholder, getDropdownIndicator } = renderSelect();
      expect(getControl()).toBeInTheDocument();
      expect(getInput()).toBeInTheDocument();
      expect(getPlaceholder()).toBeInTheDocument();
      expect(getDropdownIndicator()).toBeInTheDocument();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Menu closed by default
    });

    it('renders with custom className and id', () => {
      const { container } = renderSelect({ className: 'custom-select', id: 'my-select-id' });
      const selectContainer = container.firstChild as HTMLElement;
      expect(selectContainer).toHaveClass('custom-select');
      expect(selectContainer).toHaveAttribute('id', 'my-select-id');
    });

    it('renders placeholder when no value is selected', () => {
      const { getPlaceholder } = renderSelect({ placeholder: 'Choose one...' });
      expect(getPlaceholder()).toHaveTextContent('Choose one...');
    });

    it('renders single value when selected', () => {
      const { getSingleValue, getPlaceholder } = renderSelect({ value: options[1] });
      expect(getSingleValue()).toHaveTextContent('Two');
      expect(getPlaceholder()).not.toBeInTheDocument();
    });

    it('renders multi values when selected', () => {
      const { getMultiValues, getPlaceholder } = renderSelect<true>({
        isMulti: true,
        value: [options[0], options[2]],
      });
      const multiValues = getMultiValues();
      expect(multiValues).toHaveLength(2);
      expect(multiValues![0]).toHaveTextContent('One');
      expect(multiValues![1]).toHaveTextContent('Three');
      expect(getPlaceholder()).not.toBeInTheDocument();
    });

    it('renders clear indicator when isClearable and has value', () => {
      const { getClearIndicator } = renderSelect({ isClearable: true, value: options[0] });
      expect(getClearIndicator()).toBeInTheDocument();
    });

    it('does not render clear indicator when not clearable or no value', () => {
      const { getClearIndicator, rerender } = renderSelect({ isClearable: false, value: options[0] });
      expect(getClearIndicator()).not.toBeInTheDocument();

      rerender({ isClearable: true, value: null });
      expect(getClearIndicator()).not.toBeInTheDocument();
    });

    it('renders loading indicator when isLoading', () => {
      const { getLoadingIndicator } = renderSelect({ isLoading: true });
      expect(getLoadingIndicator()).toBeInTheDocument();
    });

    it('renders disabled state', () => {
      const { getInput, getControl } = renderSelect({ isDisabled: true });
      expect(getInput()).toBeDisabled();
      expect(getControl()).toHaveClass('react-select__control--is-disabled');
    });

    it('applies classNamePrefix', () => {
        const { getControl, getPlaceholder } = renderSelect({ classNamePrefix: 'my-prefix' });
        expect(getControl()).toHaveClass('my-prefix__control');
        expect(getPlaceholder()).toHaveClass('my-prefix__placeholder');
        // Add more checks for other prefixed elements if needed
    });

    it('renders required input when required and no value', () => {
        renderSelect({ name: 'my-field', required: true, value: null });
        // RequiredInput uses a specific structure, find by name and check focus handler
        const hiddenInput = screen.getByTestId('required-input'); // Assuming RequiredInput has data-testid
        expect(hiddenInput).toBeRequired();
        expect(hiddenInput).toHaveAttribute('name', 'my-field');
    });

     it('renders hidden form field for single select', () => {
        renderSelect({ name: 'my-field', value: options[1] });
        const hiddenInput = screen.getByRole('textbox', { hidden: true }); // Find hidden input by role
        expect(hiddenInput).toHaveAttribute('name', 'my-field');
        expect(hiddenInput).toHaveAttribute('type', 'hidden');
        expect(hiddenInput).toHaveValue('two');
     });

     it('renders multiple hidden form fields for multi select', () => {
        renderSelect<true>({ name: 'my-field', isMulti: true, value: [options[0], options[2]] });
        const hiddenInputs = screen.getAllByRole('textbox', { hidden: true });
        expect(hiddenInputs).toHaveLength(2);
        expect(hiddenInputs[0]).toHaveAttribute('name', 'my-field');
        expect(hiddenInputs[0]).toHaveValue('one');
        expect(hiddenInputs[1]).toHaveAttribute('name', 'my-field');
        expect(hiddenInputs[1]).toHaveValue('three');
     });

     it('renders delimited hidden form field for multi select with delimiter', () => {
        renderSelect<true>({ name: 'my-field', isMulti: true, value: [options[0], options[2]], delimiter: ',' });
        const hiddenInput = screen.getByRole('textbox', { hidden: true });
        expect(hiddenInput).toHaveAttribute('name', 'my-field');
        expect(hiddenInput).toHaveValue('one,three');
     });
  });

  // --- 3. User Interaction Testing ---
  describe('Interaction: Mouse', () => {
    it('opens menu on control click', async () => {
      const { user, getControl, getMenu, onMenuOpen } = renderSelect();
      await user.click(getControl());
      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1);
    });

    it('opens menu on dropdown indicator click', async () => {
      const { user, getDropdownIndicator, getMenu, onMenuOpen } = renderSelect();
      await user.click(getDropdownIndicator()!);
      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1);
    });

    it('closes menu on second control click', async () => {
      const { user, getControl, getMenu, onMenuClose } = renderSelect({ menuIsOpen: true }); // Start open
      expect(getMenu()).toBeInTheDocument();
      await user.click(getControl());
      expect(getMenu()).not.toBeInTheDocument();
      expect(onMenuClose).toHaveBeenCalledTimes(1);
    });

     it('closes menu on second dropdown indicator click', async () => {
      const { user, getDropdownIndicator, getMenu, onMenuClose } = renderSelect({ menuIsOpen: true }); // Start open
      expect(getMenu()).toBeInTheDocument();
      await user.click(getDropdownIndicator()!);
      expect(getMenu()).not.toBeInTheDocument();
      expect(onMenuClose).toHaveBeenCalledTimes(1);
    });

    it('selects option on click', async () => {
      const { user, getControl, getOption, onChange, onMenuClose } = renderSelect();
      await user.click(getControl()); // Open menu
      const optionTwo = getOption('Two');
      await user.click(optionTwo!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        options[1], // { value: 'two', label: 'Two' }
        expect.objectContaining({ action: 'select-option' })
      );
      expect(onMenuClose).toHaveBeenCalledTimes(1); // Default closeMenuOnSelect=true
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument(); // Value updated
    });

    it('does not close menu on select if closeMenuOnSelect is false', async () => {
      const { user, getControl, getOption, onChange, onMenuClose } = renderSelect({ closeMenuOnSelect: false });
      await user.click(getControl());
      await user.click(getOption('Two')!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onMenuClose).not.toHaveBeenCalled();
      expect(screen.queryByRole('listbox')).toBeInTheDocument();
    });

    it('adds option on click in multi-select', async () => {
      const { user, getControl, getOption, onChange } = renderSelect<true>({ isMulti: true });
      await user.click(getControl());
      await user.click(getOption('One')!);
      expect(onChange).toHaveBeenCalledWith(
        [options[0]],
        expect.objectContaining({ action: 'select-option', option: options[0] })
      );

      // Click another option
      await user.click(getOption('Three')!);
      expect(onChange).toHaveBeenCalledWith(
        [options[0], options[2]], // Adds to existing value
        expect.objectContaining({ action: 'select-option', option: options[2] })
      );
    });

    it('removes option on click in multi-select if already selected', async () => {
        const initialValue = [options[0], options[1]];
        const { user, getControl, getOption, onChange } = renderSelect<true>({
            isMulti: true,
            value: initialValue,
        });
        await user.click(getControl()); // Open menu
        await user.click(getOption('Two')!); // Click already selected option

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            [options[0]], // Only 'one' remains
            expect.objectContaining({ action: 'deselect-option', option: options[1] })
        );
    });


    it('clears value on clear indicator click', async () => {
      const { user, getClearIndicator, onChange } = renderSelect({
        isClearable: true,
        value: options[1],
      });
      await user.click(getClearIndicator()!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        null, // Cleared value for single select
        expect.objectContaining({ action: 'clear', removedValues: [options[1]] })
      );
    });

     it('clears multi-value on clear indicator click', async () => {
      const initialValue = [options[0], options[1]];
      const { user, getClearIndicator, onChange } = renderSelect<true>({
        isMulti: true,
        isClearable: true,
        value: initialValue,
      });
      await user.click(getClearIndicator()!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        [], // Cleared value for multi select
        expect.objectContaining({ action: 'clear', removedValues: initialValue })
      );
    });

    it('removes a multi-value option via its remove button', async () => {
      const initialValue = [options[0], options[1]];
      const { user, getMultiValues, onChange } = renderSelect<true>({
        isMulti: true,
        value: initialValue,
      });
      const multiValues = getMultiValues();
      const removeButtonOption1 = within(multiValues![0]).getByRole('button'); // Assuming remove is a button

      await user.click(removeButtonOption1);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        [options[1]], // Only 'two' remains
        expect.objectContaining({ action: 'remove-value', removedValue: options[0] })
      );
    });

    it('focuses input on control click if not focused', async () => {
        const { user, getControl, getInput, onFocus } = renderSelect();
        expect(getInput()).not.toHaveFocus();
        await user.click(getControl());
        expect(getInput()).toHaveFocus();
        expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('blurs input and closes menu when clicking outside', async () => {
        const { user, getControl, getMenu, onBlur, onMenuClose } = renderSelect();
        await user.click(getControl()); // Focus and open menu
        expect(getMenu()).toBeInTheDocument();

        await user.click(document.body); // Click outside

        expect(screen.getByRole('combobox')).not.toHaveFocus(); // Check focus moved away
        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(getMenu()).not.toBeInTheDocument();
        expect(onMenuClose).toHaveBeenCalledTimes(1);
    });

    // TODO: Add tests for onMenuMouseDown, onMenuMouseMove, onOptionHover (might need fireEvent for hover)
    // TODO: Add tests for touch events (onControlTouchEnd, onClearIndicatorTouchEnd, onDropdownIndicatorTouchEnd) - user-event might cover basic taps via click, but specific touch logic might need fireEvent.
  });

  describe('Interaction: Keyboard', () => {
    it('opens menu with ArrowDown', async () => {
      const { user, getInput, getMenu, onMenuOpen, onKeyDown } = renderSelect();
      await user.click(getInput()); // Focus input first
      await user.keyboard('{ArrowDown}');

      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1); // openMenu('first') called
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('opens menu with ArrowUp', async () => {
      const { user, getInput, getMenu, onMenuOpen, onKeyDown } = renderSelect();
      await user.click(getInput());
      await user.keyboard('{ArrowUp}');

      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1); // openMenu('last') called
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

     it('opens menu with Space', async () => {
      const { user, getInput, getMenu, onMenuOpen, onKeyDown } = renderSelect();
      await user.click(getInput());
      await user.keyboard(' '); // Space key

      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1); // openMenu('first') called
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('closes menu with Escape', async () => {
      const { user, getInput, getMenu, onMenuClose, onKeyDown } = renderSelect({ menuIsOpen: true });
      await user.click(getInput()); // Ensure focus
      expect(getMenu()).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(getMenu()).not.toBeInTheDocument();
      expect(onMenuClose).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('navigates options with ArrowDown/ArrowUp', async () => {
      const { user, getInput, getOption } = renderSelect();
      await user.click(getInput()); // Focus and open
      await user.keyboard('{ArrowDown}'); // Focus 'One'

      const input = getInput();
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('One')?.id));

      await user.keyboard('{ArrowDown}'); // Focus 'Two'
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Two')?.id));

      await user.keyboard('{ArrowUp}'); // Focus 'One'
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('One')?.id));

       // Skips disabled option 'Four'
      await user.keyboard('{ArrowDown}'); // Focus 'Two'
      await user.keyboard('{ArrowDown}'); // Focus 'Three'
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Three')?.id));
      await user.keyboard('{ArrowDown}'); // Wraps to 'One'
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('One')?.id));
    });

    it('navigates options with PageDown/PageUp/Home/End', async () => {
        const manyOptions = Array.from({ length: 15 }, (_, i) => ({ value: `val${i}`, label: `Option ${i}` }));
        const { user, getInput, getOption } = renderSelect({ options: manyOptions, pageSize: 5 });
        const input = getInput();

        await user.click(input); // Focus and open
        await user.keyboard('{PageDown}'); // Focus Option 5 (index 5)
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Option 5')?.id));

        await user.keyboard('{PageDown}'); // Focus Option 10 (index 10)
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Option 10')?.id));

        await user.keyboard('{PageUp}'); // Focus Option 5 (index 5)
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Option 5')?.id));

        await user.keyboard('{Home}'); // Focus Option 0 (index 0)
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Option 0')?.id));

        await user.keyboard('{End}'); // Focus Option 14 (index 14)
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', getOption('Option 14')?.id));
    });

    it('selects focused option with Enter', async () => {
      const { user, getInput, onChange, onMenuClose, onKeyDown } = renderSelect();
      await user.click(getInput()); // Focus and open
      await user.keyboard('{ArrowDown}'); // Focus 'One'
      await user.keyboard('{ArrowDown}'); // Focus 'Two'
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(options[1], expect.objectContaining({ action: 'select-option' }));
      expect(onMenuClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onKeyDown).toHaveBeenCalledTimes(3); // Down, Down, Enter
    });

    it('selects focused option with Tab if tabSelectsValue is true', async () => {
      const { user, getInput, onChange, onMenuClose, onKeyDown } = renderSelect({ tabSelectsValue: true });
      await user.click(getInput()); // Focus and open
      await user.keyboard('{ArrowDown}'); // Focus 'One'
      await user.keyboard('{Tab}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(options[0], expect.objectContaining({ action: 'select-option' }));
      // Tab should still move focus away, potentially closing menu via blur
      // We don't explicitly check blur here, just the selection part.
      expect(onKeyDown).toHaveBeenCalledTimes(2); // Down, Tab
    });

     it('does not select with Tab if tabSelectsValue is false', async () => {
      const { user, getInput, onChange, onKeyDown } = renderSelect({ tabSelectsValue: false }); // Default is true, explicitly set false
      await user.click(getInput()); // Focus and open
      await user.keyboard('{ArrowDown}'); // Focus 'One'
      await user.keyboard('{Tab}');

      expect(onChange).not.toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalledTimes(2); // Down, Tab
      // Focus should move naturally, menu might close on blur
    });

    it('removes last value with Backspace in multi-select when input is empty', async () => {
      const initialValue = [options[0], options[1]];
      const { user, getInput, onChange, onKeyDown } = renderSelect<true>({
        isMulti: true,
        value: initialValue,
        backspaceRemovesValue: true, // Default
      });
      await user.click(getInput()); // Focus
      await user.keyboard('{Backspace}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        [options[0]], // 'two' removed
        expect.objectContaining({ action: 'pop-value', removedValue: options[1] })
      );
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('does not remove value with Backspace if backspaceRemovesValue is false', async () => {
      const { user, getInput, onChange, onKeyDown } = renderSelect<true>({
        isMulti: true,
        value: [options[0]],
        backspaceRemovesValue: false,
      });
      await user.click(getInput());
      await user.keyboard('{Backspace}');

      expect(onChange).not.toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('clears value with Backspace in single-select if clearable and input empty', async () => {
        const { user, getInput, onChange, onKeyDown } = renderSelect({
            value: options[0],
            isClearable: true,
            backspaceRemovesValue: true, // Default
        });
        await user.click(getInput()); // Focus
        await user.keyboard('{Backspace}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            expect.objectContaining({ action: 'clear', removedValues: [options[0]] })
        );
        expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('clears value with Escape if menu closed, clearable, and escapeClearsValue', async () => {
        const { user, getInput, onChange, onKeyDown } = renderSelect({
            value: options[0],
            isClearable: true,
            escapeClearsValue: true,
            menuIsOpen: false, // Ensure menu is closed
        });
        await user.click(getInput()); // Focus
        await user.keyboard('{Escape}');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            expect.objectContaining({ action: 'clear', removedValues: [options[0]] })
        );
        expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('filters options based on input change', async () => {
      const { user, getInput, getOptions, onInputChange } = renderSelect();
      await user.type(getInput(), 'Tw');

      expect(onInputChange).toHaveBeenCalledWith('T', expect.objectContaining({ action: 'input-change' }));
      expect(onInputChange).toHaveBeenCalledWith('Tw', expect.objectContaining({ action: 'input-change' }));

      await waitFor(() => {
        const currentOptions = getOptions();
        expect(currentOptions).toHaveLength(1);
        expect(currentOptions[0]).toHaveTextContent('Two');
      });
    });

    // TODO: Test ArrowLeft/ArrowRight for focusing multi-values
    // TODO: Test interaction with isSearchable=false
  });

  // --- 4. State Management Tests ---
  describe('State Management & Controlled Props', () => {
    it('updates value correctly when controlled', () => {
      const { rerender, getSingleValue } = renderSelect({ value: options[0] });
      expect(getSingleValue()).toHaveTextContent('One');

      rerender({ value: options[1] });
      expect(getSingleValue()).toHaveTextContent('Two');

      rerender({ value: null });
      expect(getSingleValue()).not.toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument(); // Placeholder shown
    });

    it('updates inputValue correctly when controlled', () => {
      const { rerender, getInput } = renderSelect({ inputValue: 'Initial' });
      expect(getInput()).toHaveValue('Initial');

      rerender({ inputValue: 'Changed' });
      expect(getInput()).toHaveValue('Changed');
    });

    it('opens/closes menu when menuIsOpen prop changes', () => {
      const { rerender, getMenu, onMenuOpen, onMenuClose } = renderSelect({ menuIsOpen: false });
      expect(getMenu()).not.toBeInTheDocument();

      rerender({ menuIsOpen: true });
      expect(getMenu()).toBeInTheDocument();
      expect(onMenuOpen).toHaveBeenCalledTimes(1); // Called on transition false->true

      rerender({ menuIsOpen: false });
      expect(getMenu()).not.toBeInTheDocument();
      expect(onMenuClose).toHaveBeenCalledTimes(1); // Called on transition true->false
    });

    it('calls onChange when value changes via user interaction', async () => {
      const { user, getControl, getOption, onChange } = renderSelect();
      await user.click(getControl());
      await user.click(getOption('One')!);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(options[0], expect.anything());
    });

    it('calls onInputChange when user types', async () => {
      const { user, getInput, onInputChange } = renderSelect();
      await user.type(getInput(), 'Test');
      expect(onInputChange).toHaveBeenCalledTimes(4); // Once per character
      expect(onInputChange).toHaveBeenLastCalledWith('Test', expect.objectContaining({ action: 'input-change' }));
    });

    it('calls onFocus/onBlur', async () => {
        const { user, getInput, onFocus, onBlur } = renderSelect();
        await user.click(getInput());
        expect(onFocus).toHaveBeenCalledTimes(1);

        await user.click(document.body); // Blur
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    // Test focus management related state (e.g., focusedOption) implicitly via keyboard nav tests
  });

  // --- 5. Menu and Options Tests ---
  describe('Menu & Options', () => {
    it('renders options correctly', async () => {
      const { user, getControl, getOptions } = renderSelect();
      await user.click(getControl());
      const renderedOptions = getOptions();
      expect(renderedOptions).toHaveLength(options.length); // Includes disabled
      expect(renderedOptions[0]).toHaveTextContent('One');
      expect(renderedOptions[1]).toHaveTextContent('Two');
      expect(renderedOptions[2]).toHaveTextContent('Three');
      expect(renderedOptions[3]).toHaveTextContent('Four (Disabled)');
    });

    it('renders grouped options correctly', async () => {
      const { user, getControl } = renderSelect({ options: groupedOptions });
      await user.click(getControl());

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      // Check options within groups (RTL doesn't easily query within specific group elements by default)
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Four (Disabled)')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    it('renders noOptionsMessage when options are empty', async () => {
      const { user, getControl } = renderSelect({ options: [], noOptionsMessage: () => 'No data' });
      await user.click(getControl());
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

     it('renders noOptionsMessage when filter returns no results', async () => {
      const { user, getInput } = renderSelect({ noOptionsMessage: () => 'No results found' });
      await user.type(getInput(), 'xyz');
      await waitFor(() => {
          expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('renders loadingMessage when isLoading and menu is open', async () => {
      const { user, getControl } = renderSelect({ isLoading: true, loadingMessage: () => 'Fetching...' });
      await user.click(getControl());
      expect(screen.getByText('Fetching...')).toBeInTheDocument();
      // Should not show options or no options message
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
      expect(screen.queryByText('No options')).not.toBeInTheDocument();
    });

    it('uses custom filterOption', async () => {
      const customFilter = jest.fn((option, inputValue) =>
        option.label.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      const { user, getInput, getOptions } = renderSelect({ filterOption: customFilter });

      await user.type(getInput(), 'O');
      await waitFor(() => expect(getOptions()).toHaveLength(1)); // Only 'One'
      expect(customFilter).toHaveBeenCalled();
    });

    it('disables option based on isOptionDisabled prop', async () => {
      const customIsDisabled = jest.fn((option) => option.value === 'two');
      const { user, getControl, getOption, onChange } = renderSelect({ isOptionDisabled: customIsDisabled });

      await user.click(getControl());
      const optionTwo = getOption('Two');
      expect(optionTwo).toHaveAttribute('aria-disabled', 'true');

      // Try clicking disabled option
      await user.click(optionTwo!);
      expect(onChange).not.toHaveBeenCalled(); // Should not select
      expect(screen.getByRole('listbox')).toBeInTheDocument(); // Menu should stay open
    });

     it('hides selected options in multi-select if hideSelectedOptions is true', async () => {
        const { user, getControl, getOptions } = renderSelect<true>({
            isMulti: true,
            value: [options[0]], // 'One' is selected
            hideSelectedOptions: true,
        });
        await user.click(getControl());
        const currentOptions = getOptions();
        expect(currentOptions).toHaveLength(options.length - 1); // 'One' should be hidden
        expect(screen.queryByText('One')).not.toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
     });

     it('formats option label using formatOptionLabel', async () => {
        const formatOptionLabel = jest.fn((option: OptionType, meta) => `${option.label} (${meta.context})`);
        const { user, getControl, getOption, getSingleValue } = renderSelect({
            value: options[0],
            formatOptionLabel: formatOptionLabel,
        });

        // Check value format
        expect(getSingleValue()).toHaveTextContent('One (value)');
        expect(formatOptionLabel).toHaveBeenCalledWith(options[0], expect.objectContaining({ context: 'value' }));

        formatOptionLabel.mockClear();

        // Check menu format
        await user.click(getControl());
        expect(getOption('One (menu)')).toBeInTheDocument();
        expect(formatOptionLabel).toHaveBeenCalledWith(options[0], expect.objectContaining({ context: 'menu' }));
        expect(formatOptionLabel).toHaveBeenCalledWith(options[1], expect.objectContaining({ context: 'menu' }));
     });

     // TODO: Test formatGroupLabel
     // TODO: Test menuPlacement, menuPosition, menuPortalTarget (might require more complex DOM setup or visual regression tests)
  });

  // --- 6. Accessibility Testing ---
  describe('Accessibility (ARIA)', () => {
    it('has correct initial ARIA attributes', () => {
      const { getInput } = renderSelect({ 'aria-label': 'Fruit Select' });
      const input = getInput();
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-label', 'Fruit Select');
      expect(input).not.toHaveAttribute('aria-activedescendant');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-placeholder'));
    });

    it('updates aria-expanded when menu opens/closes', async () => {
      const { user, getInput, getControl } = renderSelect();
      const input = getInput();
      await user.click(getControl());
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls', expect.stringContaining('-listbox'));

      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-controls');
    });

    it('updates aria-activedescendant during keyboard navigation', async () => {
      const { user, getInput, getOption } = renderSelect();
      const input = getInput();
      await user.click(input); // Open menu

      await user.keyboard('{ArrowDown}'); // Focus 'One'
      const optionOne = getOption('One');
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', optionOne?.id));

      await user.keyboard('{ArrowDown}'); // Focus 'Two'
      const optionTwo = getOption('Two');
      await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', optionTwo?.id));

      await user.keyboard('{Escape}'); // Close menu
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('sets aria-disabled on disabled options', async () => {
        const { user, getControl, getOption } = renderSelect();
        await user.click(getControl());
        const disabledOption = getOption('Four (Disabled)');
        expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });

    // Note: Testing aria-live region updates is tricky. You might need to:
    // 1. Render the LiveRegion component directly in separate tests.
    // 2. Use snapshots to capture the LiveRegion's output after specific actions.
    // 3. Use `waitFor` and check the text content of the live region element.
    it('renders live region', () => {
        renderSelect();
        const liveRegion = screen.getByRole('log', { hidden: true }); // Assuming LiveRegion uses role="log" or similar
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveAttribute('aria-live', 'polite'); // Default
        expect(liveRegion).toHaveAttribute('id', expect.stringContaining('-live-region'));
    });

    it('applies aria-invalid and aria-errormessage', () => {
        const errorId = 'input-error';
        renderSelect({
            'aria-invalid': true,
            'aria-errormessage': errorId,
        });
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-errormessage', errorId);
    });

     it('applies aria-required', () => {
        renderSelect({ required: true });
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    });
  });

  // --- 7. Edge Case Testing ---
  describe('Edge Cases', () => {
    it('handles null options gracefully', async () => {
      const { user, getControl } = renderSelect({ options: null as any, noOptionsMessage: () => 'No data' });
      await user.click(getControl());
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('handles null value correctly', () => {
      const { getPlaceholder } = renderSelect({ value: null });
      expect(getPlaceholder()).toBeInTheDocument();
    });

    it('does not open menu on click when disabled', async () => {
      const { user, getControl, getMenu, onMenuOpen } = renderSelect({ isDisabled: true });
      await user.click(getControl());
      expect(getMenu()).not.toBeInTheDocument();
      expect(onMenuOpen).not.toHaveBeenCalled();
    });

    it('does not allow clearing when disabled', async () => {
        const { user, getClearIndicator, onChange } = renderSelect({
            isDisabled: true,
            isClearable: true,
            value: options[0],
        });
        // Clear indicator shouldn't even render when disabled
        expect(getClearIndicator()).not.toBeInTheDocument();
    });

    it('handles autoFocus prop', () => {
        // Note: JSDOM doesn't fully support autoFocus, but we can check if the focus method was called.
        // We need to spy on the instance method, which is hard with RTL.
        // Alternative: Check if the element has focus shortly after render.
        const { getInput } = renderSelect({ autoFocus: true });
        expect(getInput()).toHaveFocus();
    });

    it('closes menu on scroll if closeMenuOnScroll is true', () => {
        const handleMenuClose = jest.fn();
        renderSelect({ menuIsOpen: true, closeMenuOnScroll: true, onMenuClose: handleMenuClose });

        // Simulate scroll event on document
        fireEvent.scroll(document, { target: document.documentElement });

        expect(handleMenuClose).toHaveBeenCalledTimes(1);
    });

     it('closes menu on scroll based on function result', () => {
        const scrollShouldClose = jest.fn(() => true);
        const handleMenuClose = jest.fn();
        renderSelect({ menuIsOpen: true, closeMenuOnScroll: scrollShouldClose, onMenuClose: handleMenuClose });

        const scrollEvent = new Event('scroll');
        fireEvent(document, scrollEvent);

        expect(scrollShouldClose).toHaveBeenCalledWith(scrollEvent);
        expect(handleMenuClose).toHaveBeenCalledTimes(1);

        scrollShouldClose.mockReturnValueOnce(false);
        handleMenuClose.mockClear();
        fireEvent(document, scrollEvent);
        expect(handleMenuClose).not.toHaveBeenCalled();
    });

    // TODO: Test composition events (onCompositionStart/End) - might require fireEvent
  });

  // --- 8. Performance Testing (Basic Check) ---
  describe('Performance (Basic)', () => {
    it('renders reasonably fast with many options', async () => {
      const largeOptions = Array.from({ length: 500 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));
      const { user, getControl, getOptions } = renderSelect({ options: largeOptions });

      const startTime = performance.now();
      await user.click(getControl()); // Open menu
      const endTime = performance.now();

      // Check if options are rendered (maybe just a subset due to virtualization potential)
      expect(getOptions().length).toBeGreaterThan(10); // Check a reasonable number are present

      // Basic timing check - adjust threshold as needed
      expect(endTime - startTime).toBeLessThan(500); // e.g., less than 500ms to open and render initial view
    });
  });

  // --- 9. Test Coverage & Prop Variations ---
  // Add more tests specifically targeting props not covered above or specific branches
  describe('Prop Variations', () => {
      it('does not open menu on focus if openMenuOnFocus is false', async () => {
          const { user, getInput, getMenu, onMenuOpen } = renderSelect({ openMenuOnFocus: false }); // Default
          await user.click(getInput()); // Focus
          expect(getMenu()).not.toBeInTheDocument();
          expect(onMenuOpen).not.toHaveBeenCalled();
      });

      it('opens menu on focus if openMenuOnFocus is true', async () => {
          const { user, getInput, getMenu, onMenuOpen } = renderSelect({ openMenuOnFocus: true });
          await user.click(getInput()); // Focus
          expect(getMenu()).toBeInTheDocument();
          expect(onMenuOpen).toHaveBeenCalledTimes(1);
      });

       it('does not open menu on click if openMenuOnClick is false', async () => {
          const { user, getControl, getMenu, onMenuOpen } = renderSelect({ openMenuOnClick: false });
          await user.click(getControl()); // Click
          expect(getMenu()).not.toBeInTheDocument();
          expect(onMenuOpen).not.toHaveBeenCalled();
       });

       it('blurs input on select if blurInputOnSelect is true', async () => {
           const { user, getControl, getOption, getInput, onBlur } = renderSelect({ blurInputOnSelect: true }); // Default for non-touch
           await user.click(getControl());
           await user.click(getOption('One')!);
           expect(getInput()).not.toHaveFocus();
           // Blur might be called async, wait for it
           await waitFor(() => expect(onBlur).toHaveBeenCalled());
       });

       it('keeps focus on select if blurInputOnSelect is false', async () => {
           const { user, getControl, getOption, getInput, onBlur } = renderSelect({ blurInputOnSelect: false });
           await user.click(getControl());
           await user.click(getOption('One')!);
           expect(getInput()).toHaveFocus();
           expect(onBlur).not.toHaveBeenCalled();
       });

       // TODO: Test `controlShouldRenderValue={false}`
       // TODO: Test `menuShouldBlockScroll` (hard to test in JSDOM, relies on ScrollManager)
       // TODO: Test `captureMenuScroll` (hard to test in JSDOM)
       // TODO: Test `unstyled` prop effects (check for lack of default classes/styles)
  });

});
```

**Explanation and Key Points:**

1.  **Setup (`jest.config.js`, `setupTests.ts`):** Configures Jest for TypeScript, JSDOM, adds Jest-DOM matchers, mocks browser APIs unavailable in JSDOM (`scrollIntoView`, `matchMedia`, `ResizeObserver`), and sets up automatic cleanup.
2.  **Mocking Utilities:** Crucial for isolating the `Select` component and controlling environment-dependent behavior (`isTouchCapable`, `isAppleDevice`, etc.). Place mocks in `__mocks__` directories adjacent to the original files or configure `moduleNameMapper` in Jest config. Use `jest.mock('../path/to/module')` at the top of the test file.
3.  **`renderSelect` Helper:** A factory function to render the `Select` component with default props, test-specific props, and mocked callbacks (`onChange`, `onInputChange`, etc.). It also returns utility functions (`getControl`, `getInput`, `getMenu`, etc.) for querying elements and the `userEvent` instance. This reduces boilerplate in individual tests.
4.  **`userEvent`:** Preferred over `fireEvent` for simulating user interactions as it more closely mimics real browser behavior (handles focus, keyboard event sequences, etc.).
5.  **Queries:** Uses RTL's `screen` queries (`getByRole`, `getByText`, `queryByRole`, etc.). `getBy*` throws an error if not found, `queryBy*` returns `null`, `findBy*` returns a promise for async elements.
6.  **`waitFor`:** Used when asserting changes that happen asynchronously after an interaction (e.g., menu opening/closing, filtering updates, ARIA attribute changes).
7.  **Logical Grouping (`describe`):** Tests are grouped based on the requirements (Rendering, Interaction, State, Menu, Accessibility, Edge Cases, Performance, Props).
8.  **Test Cases (`it`):** Each `it` block tests a specific piece of functionality with clear descriptions.
9.  **Assertions (`expect`):** Uses `@testing-library/jest-dom` matchers (`.toBeInTheDocument()`, `.toHaveAttribute()`, `.toHaveClass()`, `.toHaveValue()`, `.toBeDisabled()`, `.toHaveFocus()`) and Jest's core matchers (`.toHaveBeenCalledTimes()`, `.toHaveBeenCalledWith()`).
10. **Accessibility:** Explicitly checks for important ARIA attributes (`role`, `aria-*`) and their changes during interaction. Testing live regions is noted as complex.
11. **Controlled Props:** Tests verify that the component correctly reflects changes to controlled props (`value`, `inputValue`, `menuIsOpen`) and calls the appropriate callbacks (`onChange`, `onInputChange`, etc.) when the user interacts.
12. **Edge Cases:** Includes tests for `null` values/options, disabled states, `autoFocus`, and scroll behavior.
13. **Performance:** A *very basic* check using `performance.now()` to ensure rendering many options doesn't take an excessive amount of time. Real performance testing requires dedicated tools.
14. **Coverage:** The structure aims for broad coverage. Run `jest --coverage` to identify gaps and add more specific tests as needed to reach the 80% target. Focus on testing different prop combinations and conditional logic branches within the component.
15. **Documentation:** Clear test descriptions and comments explain the purpose of tests.

This suite provides a solid foundation for testing the `Select` component. Remember to adjust import paths and potentially add more specific mocks or tests based on the exact implementation details of your internal components and utilities.

### Tokens: {'input_tokens': 18451, 'output_tokens': 12756}
### Execution time: 119.4010660648346
