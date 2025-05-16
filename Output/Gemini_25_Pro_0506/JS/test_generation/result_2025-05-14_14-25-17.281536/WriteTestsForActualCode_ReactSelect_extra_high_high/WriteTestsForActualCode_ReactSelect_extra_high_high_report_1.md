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
Okay, this is a substantial React component, and creating comprehensive unit tests will involve several steps. I'll structure the tests according to your requirements.

**1. Test Environment Setup**

First, ensure you have the necessary dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
# or
yarn add --dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Jest Configuration (`jest.config.js` or similar):**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // if you have a setup file
  moduleNameMapper: {
    // Mock CSS/image files if your components import them
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  // collectCoverage: true, // Enable if you want coverage reports by default
  // coverageReporters: ["json", "lcov", "text", "clover"],
  // coverageThreshold: { // Optional: enforce coverage levels
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10, // Or a positive number
  //   },
  // },
};
```

**Setup File (`src/setupTests.ts`):**

```typescript
import '@testing-library/jest-dom';

// Mock global objects or functions if necessary
// For example, if your component uses IntersectionObserver and JSDOM doesn't support it fully:
// global.IntersectionObserver = jest.fn(() => ({
//   observe: jest.fn(),
//   unobserve: jest.fn(),
//   disconnect: jest.fn(),
// }));

// Mock document event listeners that might be added by the component
// We will mock specific utility functions directly in the test file or via jest.mock
```

**Create `index.test.tsx` next to your `index.tsx` file.**

```tsx
// index.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // For more realistic user interactions
import Select, { Props, defaultProps, FormatOptionLabelMeta } from './index'; // Adjust path if needed
import { GroupBase, OptionsOrGroups } from './types';

// --- Mocking Dependencies ---

// Mock utility functions from './utils'
const mockIsTouchCapable = jest.fn(() => false);
const mockIsMobileDevice = jest.fn(() => false);
const mockScrollIntoView = jest.fn();
const mockIsDocumentElement = jest.fn((el: HTMLElement) => el === document.documentElement || el === document.body);

jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils');
  return {
    ...originalModule,
    isTouchCapable: () => mockIsTouchCapable(),
    isMobileDevice: () => mockIsMobileDevice(),
    scrollIntoView: (...args: any[]) => mockScrollIntoView(...args),
    isDocumentElement: (el: HTMLElement) => mockIsDocumentElement(el),
  };
});

// Mock helpers from './accessibility/helpers'
const mockIsAppleDevice = jest.fn(() => false);
jest.mock('./accessibility/helpers', () => {
  const originalModule = jest.requireActual('./accessibility/helpers');
  return {
    ...originalModule,
    isAppleDevice: () => mockIsAppleDevice(),
  };
});

// Mock MenuPlacer to simplify testing its complex positioning logic
jest.mock('./components/Menu', () => {
    const original = jest.requireActual('./components/Menu');
    return {
        ...original,
        MenuPlacer: jest.fn(({ children, menuPlacement, menuPosition, minMenuHeight, maxMenuHeight }) => {
            const ref = jest.fn();
            // Provide mock placerProps that the Menu component expects
            const placerProps = { placement: menuPlacement || 'bottom', maxHeight: maxMenuHeight || 300 };
            // @ts-ignore
            return children({ ref, placerProps });
        }),
    };
});

// Mock ScrollManager (if its internal logic is complex or involves timers/observers not easily testable)
// For this component, ScrollManager mainly provides a ref.
jest.mock('./internal/ScrollManager', () => {
    return jest.fn(({ children }) => {
        const scrollTargetRef = jest.fn();
        // @ts-ignore
        return children(scrollTargetRef);
    });
});


// --- Test Setup ---

interface TestOption {
  value: string;
  label: string;
  isDisabled?: boolean;
  [key: string]: any; // Allow other properties
}

const options: TestOption[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'caramel', label: 'Caramel', isDisabled: true },
  { value: 'mint', label: 'Mint' },
];

const groupedOptions: OptionsOrGroups<TestOption, GroupBase<TestOption>> = [
  {
    label: 'Fruity',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Sweet',
    options: [
      { value: 'chocolate', label: 'Chocolate' }, // Re-using for simplicity
      { value: 'vanilla', label: 'Vanilla', isDisabled: true },
    ],
  },
];

// Helper to provide default and overridden props
const getProps = <
  Option = TestOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Partial<Props<Option, IsMulti, Group>> = {}
): Props<Option, IsMulti, Group> => ({
  ...defaultProps, // Spread defaultProps from the component
  instanceId: props.instanceId || 'test-select', // Ensure a deterministic ID for tests
  options: (props.options || options) as OptionsOrGroups<Option, Group>,
  onChange: jest.fn(),
  onInputChange: jest.fn(),
  onMenuOpen: jest.fn(),
  onMenuClose: jest.fn(),
  onFocus: jest.fn(),
  onBlur: jest.fn(),
  // Merge deeply nested defaults if necessary
  classNames: { ...defaultProps.classNames, ...props.classNames },
  components: { ...defaultProps.components, ...props.components },
  styles: { ...defaultProps.styles, ...props.styles },
  ...props,
});

// Reset mocks before each test
beforeEach(() => {
  mockIsTouchCapable.mockReturnValue(false);
  mockIsMobileDevice.mockReturnValue(false);
  mockScrollIntoView.mockClear();
  mockIsDocumentElement.mockImplementation((el: HTMLElement) => el === document.documentElement || el === document.body);
  mockIsAppleDevice.mockReturnValue(false);
  
  // Reset document event listener mocks if they were spied on globally
  // (document.addEventListener as jest.Mock)?.mockClear();
  // (document.removeEventListener as jest.Mock)?.mockClear();
  // For this setup, we rely on the component's componentWillUnmount to clean up.
  // If testing specific document listeners, spy on them:
  // jest.spyOn(document, 'addEventListener');
  // jest.spyOn(document, 'removeEventListener');
});

afterEach(() => {
    // jest.restoreAllMocks(); // If using jest.spyOn
});


describe('Select Component', () => {
  // User for more complex interactions
  const user = userEvent.setup();

  // --- 2. Component Rendering Tests ---
  describe('Component Rendering', () => {
    it('should render with default props', () => {
      render(<Select {...getProps()} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument();
    });

    it('should apply className and id to the SelectContainer', () => {
      const props = getProps({ className: 'custom-class', id: 'custom-id' });
      render(<Select {...props} />);
      // The container is the outermost element rendered by SelectContainer
      const container = screen.getByRole('combobox').closest('div[id="custom-id"]');
      expect(container).toHaveClass('custom-class');
    });

    it('should use instanceId for generating element IDs', () => {
      render(<Select {...getProps({ instanceId: 'my-unique-select' })} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-unique-select-input');
      expect(screen.getByText(defaultProps.placeholder as string)).toHaveAttribute('id', 'my-unique-select-placeholder');
    });

    it('should render with a custom inputId', () => {
      render(<Select {...getProps({ inputId: 'custom-input-id' })} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-input-id');
    });

    it('should render as disabled if isDisabled prop is true', () => {
      render(<Select {...getProps({ isDisabled: true })} />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should render non-searchable select with DummyInput', () => {
      render(<Select {...getProps({ isSearchable: false })} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('inputmode', 'none');
      expect(input).toHaveAttribute('aria-readonly', 'true');
    });

    it('should not render value in control if controlShouldRenderValue is false', () => {
        render(<Select {...getProps({ value: options[0], controlShouldRenderValue: false })} />);
        expect(screen.queryByText(options[0].label)).not.toBeInTheDocument();
        expect(screen.getByText(defaultProps.placeholder as string)).toBeInTheDocument();
    });

    it('should render required hidden input if required and no value', () => {
        render(<Select {...getProps({ name: 'test-required', required: true, value: null })} />);
        const hiddenInput = document.querySelector('input[name="test-required"]');
        expect(hiddenInput).toBeInTheDocument();
        // The RequiredInput component itself might have specific attributes or behavior to check
    });
  });

  // --- 3. User Interaction Testing (Focus, Input, Clicks) ---
  describe('User Interactions', () => {
    it('should call onFocus and onBlur handlers', () => {
      const props = getProps();
      render(<Select {...props} />);
      const input = screen.getByRole('combobox');
      
      fireEvent.focus(input);
      expect(props.onFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(input);
      expect(props.onBlur).toHaveBeenCalledTimes(1);
    });

    it('should call onInputChange when typing', async () => {
      const props = getProps();
      render(<Select {...props} />);
      const input = screen.getByRole('combobox');
      await user.type(input, 'cho');
      expect(props.onInputChange).toHaveBeenCalledWith('c', expect.objectContaining({ action: 'input-change' }));
      expect(props.onInputChange).toHaveBeenCalledWith('ch', expect.objectContaining({ action: 'input-change' }));
      expect(props.onInputChange).toHaveBeenCalledWith('cho', expect.objectContaining({ action: 'input-change' }));
    });

    it('should open menu on control click if openMenuOnClick is true (default)', async () => {
      const props = getProps();
      render(<Select {...props} />);
      const control = screen.getByRole('combobox').closest('div[class*="control"]'); // Get the control div
      expect(control).toBeInTheDocument();
      
      await user.click(control!);
      expect(props.onMenuOpen).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open/close menu on dropdown indicator click', async () => {
      const props = getProps();
      render(<Select {...props} />);
      const dropdownIndicator = screen.getByRole('combobox').parentElement?.nextSibling?.lastChild as HTMLElement;
      expect(dropdownIndicator).toBeInTheDocument(); // Assuming DropdownIndicator is last in IndicatorsContainer

      // Open
      await user.click(dropdownIndicator);
      expect(props.onMenuOpen).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Close
      await user.click(dropdownIndicator);
      expect(props.onMenuClose).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });

    it('should clear value on ClearIndicator click', async () => {
      const props = getProps({ value: options[0], isClearable: true });
      render(<Select {...props} />);
      // ClearIndicator is usually the first child in IndicatorsContainer if rendered
      const clearIndicator = screen.getByRole('combobox').parentElement?.nextSibling?.firstChild as HTMLElement;
      expect(clearIndicator).toBeInTheDocument();

      await user.click(clearIndicator);
      expect(props.onChange).toHaveBeenCalledWith(null, expect.objectContaining({ action: 'clear' }));
    });
  });

  // --- 4. State Management Tests ---
  describe('State Management', () => {
    it('should reflect controlled `value` prop', () => {
      const { rerender } = render(<Select {...getProps({ value: options[0] })} />);
      expect(screen.getByText(options[0].label)).toBeInTheDocument();

      rerender(<Select {...getProps({ value: options[1] })} />);
      expect(screen.queryByText(options[0].label)).not.toBeInTheDocument();
      expect(screen.getByText(options[1].label)).toBeInTheDocument();
    });

    it('should reflect controlled `inputValue` prop', () => {
      const { rerender } = render(<Select {...getProps({ inputValue: "test" })} />);
      expect(screen.getByRole('combobox')).toHaveValue('test');

      rerender(<Select {...getProps({ inputValue: "new test" })} />);
      expect(screen.getByRole('combobox')).toHaveValue('new test');
    });
    
    it('should update focusable options when options prop changes while menu is open', async () => {
        const initialOpts = [{ value: 'one', label: 'One' }];
        const { rerender } = render(<Select {...getProps({ options: initialOpts, menuIsOpen: true, instanceId: 'opts-change' })} />);
        
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.queryByText('Two')).not.toBeInTheDocument();

        const newOpts = [...initialOpts, { value: 'two', label: 'Two' }];
        // Important: Pass all necessary props again, especially instanceId if it affects option IDs
        rerender(<Select {...getProps({ options: newOpts, menuIsOpen: true, instanceId: 'opts-change' })} />);
        
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
        
        const input = screen.getByRole('combobox');
        await user.type(input, '{arrowdown}'); // Focus One
        expect(input).toHaveAttribute('aria-activedescendant', 'opts-change-option-0');
        await user.type(input, '{arrowdown}'); // Focus Two
        expect(input).toHaveAttribute('aria-activedescendant', 'opts-change-option-1');
    });
  });

  // --- 5. Menu and Options Tests ---
  describe('Menu and Options', () => {
    it('should open menu and display options', () => {
      render(<Select {...getProps({ menuIsOpen: true })} />);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      options.forEach(opt => {
        if (!opt.isDisabled) { // Only non-disabled options are typically listed by default unless customized
          expect(screen.getByText(opt.label)).toBeInTheDocument();
        }
      });
    });

    it('should filter options based on input', () => {
      render(<Select {...getProps({ menuIsOpen: true, inputValue: "Straw" })} />);
      expect(screen.getByText('Strawberry')).toBeInTheDocument();
      expect(screen.queryByText('Chocolate')).not.toBeInTheDocument();
    });

    it('should display noOptionsMessage when filter yields no results', () => {
      const noOptionsMsg = "Sorry, nothing found!";
      render(<Select {...getProps({ menuIsOpen: true, inputValue: "xyz", noOptionsMessage: () => noOptionsMsg })} />);
      expect(screen.getByText(noOptionsMsg)).toBeInTheDocument();
    });

    it('should select option on click and call onChange', async () => {
      const props = getProps({ menuIsOpen: true });
      render(<Select {...props} />);
      const optionToSelect = screen.getByText(options[1].label); // Strawberry
      
      await user.click(optionToSelect);
      expect(props.onChange).toHaveBeenCalledWith(options[1], expect.objectContaining({ action: 'select-option', option: options[1] }));
    });

    it('should handle multi-select: add and remove options', async () => {
      const props = getProps<TestOption, true>({ isMulti: true, menuIsOpen: true, closeMenuOnSelect: false });
      render(<Select {...props} />);

      // Select Chocolate
      await user.click(screen.getByText(options[0].label));
      expect(props.onChange).toHaveBeenCalledWith([options[0]], expect.objectContaining({ option: options[0] }));
      (props.onChange as jest.Mock).mockClear(); // Clear mock for next assertion

      // Select Strawberry (assuming current value in "state" is [options[0]])
      // To simulate this, we need to update the value prop if it's controlled, or rely on internal state.
      // For simplicity, let's assume the component handles internal state correctly for now.
      // A more robust test would re-render with the new value if testing controlled behavior.
      await user.click(screen.getByText(options[1].label));
      expect(props.onChange).toHaveBeenCalledWith(
        expect.arrayContaining([options[0], options[1]]), // Order might not be guaranteed by default
        expect.objectContaining({ option: options[1] })
      );
       (props.onChange as jest.Mock).mockClear();

      // Deselect Chocolate (by clicking it again in the menu)
      await user.click(screen.getByText(options[0].label));
       expect(props.onChange).toHaveBeenCalledWith(
        [options[1]], // Only Strawberry remains
        expect.objectContaining({ action: 'deselect-option', option: options[0] })
      );
    });

    it('should not select disabled options', async () => {
      const props = getProps({ menuIsOpen: true });
      render(<Select {...props} />);
      const disabledOption = screen.getByText(options.find(o => o.isDisabled)!.label); // Caramel
      
      await user.click(disabledOption);
      expect(props.onChange).not.toHaveBeenCalledWith(expect.objectContaining({ option: options.find(o => o.isDisabled)}));
    });

    it('should hide selected options if hideSelectedOptions is true (multi-select)', () => {
        render(
            <Select {...getProps<TestOption, true>({ 
                menuIsOpen: true, 
                isMulti: true, 
                value: [options[0]], // Chocolate is selected
                hideSelectedOptions: true,
            })} 
            />
        );
        // In the menu, Chocolate should not be present
        const menu = screen.getByRole('listbox');
        expect(menu).not.toHaveTextContent(options[0].label);
        expect(menu).toHaveTextContent(options[1].label); // Strawberry should be
    });

    it('should use formatOptionLabel for rendering options', () => {
        const formatOptionLabel = jest.fn((data: TestOption, meta: FormatOptionLabelMeta<TestOption>) => 
            `${data.label} - ${meta.context} - ${meta.inputValue}`
        );
        render(<Select {...getProps({ 
            menuIsOpen: true, 
            value: options[0], 
            inputValue: "testInput",
            formatOptionLabel 
        })} />);

        // Check selected value display
        expect(formatOptionLabel).toHaveBeenCalledWith(options[0], expect.objectContaining({ context: 'value', inputValue: "testInput", selectValue: [options[0]] }));
        expect(screen.getByText(`${options[0].label} - value - testInput`)).toBeInTheDocument();

        // Check menu item display
        expect(formatOptionLabel).toHaveBeenCalledWith(options[1], expect.objectContaining({ context: 'menu', inputValue: "testInput", selectValue: [options[0]] }));
        expect(screen.getByText(`${options[1].label} - menu - testInput`)).toBeInTheDocument();
    });

    it('should render grouped options correctly', () => {
        render(<Select {...getProps({ options: groupedOptions, menuIsOpen: true })} />);
        expect(screen.getByText('Fruity')).toBeInTheDocument(); // Group label
        expect(screen.getByText('Apple')).toBeInTheDocument();  // Option within group
        expect(screen.getByText('Sweet')).toBeInTheDocument();
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
    });
  });

  // --- 6. Accessibility Testing ---
  describe('Accessibility (ARIA)', () => {
    it('should have correct ARIA attributes when closed', () => {
      render(<Select {...getProps({ 'aria-label': 'My Select' })} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-label', 'My Select');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'true');
      expect(input).not.toHaveAttribute('aria-controls');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('should have correct ARIA attributes when open', () => {
      render(<Select {...getProps({ menuIsOpen: true, instanceId: 'aria-test' })} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-controls', 'aria-test-listbox');
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('id', 'aria-test-listbox');
    });

    it('should update aria-activedescendant on keyboard navigation', async () => {
      render(<Select {...getProps({ menuIsOpen: true, instanceId: 'aria-nav' })} />);
      const input = screen.getByRole('combobox');
      
      await user.type(input, '{arrowdown}'); // Focus first option
      expect(input).toHaveAttribute('aria-activedescendant', 'aria-nav-option-0');
      
      await user.type(input, '{arrowdown}'); // Focus second option
      expect(input).toHaveAttribute('aria-activedescendant', 'aria-nav-option-1');
    });

    it('should set aria-selected on options (unless Apple device)', () => {
        mockIsAppleDevice.mockReturnValue(false);
        render(<Select {...getProps({ menuIsOpen: true, value: options[0] })} />);
        const selectedOption = screen.getByRole('option', { name: options[0].label });
        expect(selectedOption).toHaveAttribute('aria-selected', 'true');
        const unselectedOption = screen.getByRole('option', { name: options[1].label });
        expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });

    it('should NOT set aria-selected on options if Apple device', () => {
        mockIsAppleDevice.mockReturnValue(true);
        render(<Select {...getProps({ menuIsOpen: true, value: options[0] })} />);
        const selectedOption = screen.getByRole('option', { name: options[0].label });
        expect(selectedOption).not.toHaveAttribute('aria-selected');
    });

    it('should render LiveRegion for screen reader announcements', () => {
        render(<Select {...getProps({ instanceId: 'live-region-check' })} />);
        // The LiveRegion component itself is responsible for its ARIA attributes (e.g., aria-live)
        // We check for its presence by ID.
        expect(document.getElementById('live-region-check-live-region')).toBeInTheDocument();
    });
  });

  // --- Keyboard Navigation (overlaps with User Interaction and Accessibility) ---
  describe('Keyboard Navigation', () => {
    it('should close menu on Escape key', async () => {
      const props = getProps({ menuIsOpen: true });
      render(<Select {...props} />);
      const input = screen.getByRole('combobox');
      
      await user.type(input, '{escape}');
      expect(props.onMenuClose).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });

    it('should select focused option on Enter key', async () => {
      const props = getProps({ menuIsOpen: true });
      render(<Select {...props} />);
      const input = screen.getByRole('combobox');
      
      await user.type(input, '{arrowdown}'); // Focus first option (Chocolate)
      await user.type(input, '{enter}');
      
      expect(props.onChange).toHaveBeenCalledWith(options[0], expect.objectContaining({ action: 'select-option' }));
    });

    it('should navigate options with ArrowUp/ArrowDown, Home, End, PageUp, PageDown', async () => {
        const manyOptions = Array.from({length: 12}, (_, i) => ({value: `v${i}`, label: `Option ${i}`}));
        render(<Select {...getProps({ menuIsOpen: true, options: manyOptions, pageSize: 5, instanceId: 'key-nav-full' })} />);
        const input = screen.getByRole('combobox');

        await user.type(input, '{arrowdown}'); // Opt 0
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-0');
        await user.type(input, '{arrowdown}'); // Opt 1
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-1');
        await user.type(input, '{pagedown}'); // Opt 1 + 5 = Opt 6
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-6');
        await user.type(input, '{pageup}'); // Opt 6 - 5 = Opt 1
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-1');
        await user.type(input, '{end}'); // Opt 11 (last)
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-11');
        await user.type(input, '{home}'); // Opt 0 (first)
        expect(input).toHaveAttribute('aria-activedescendant', 'key-nav-full-option-0');
    });

    it('should remove value with Backspace if backspaceRemovesValue (multi-select)', async () => {
        const props = getProps<TestOption, true>({ 
            isMulti: true, 
            value: [options[0], options[1]], 
            backspaceRemovesValue: true // default
        });
        render(<Select {...props} />);
        const input = screen.getByRole('combobox');
        await user.type(input, '{backspace}'); // Pops options[1] (Strawberry)
        expect(props.onChange).toHaveBeenCalledWith([options[0]], expect.objectContaining({ action: 'pop-value', removedValue: options[1] }));
    });
    
    it('should select with Tab if tabSelectsValue and option focused', async () => {
        const props = getProps({ menuIsOpen: true, tabSelectsValue: true });
        render(<Select {...props} />);
        const input = screen.getByRole('combobox');
        await user.type(input, '{arrowdown}'); // Focus Chocolate
        
        // userEvent.tab() simulates full browser tabbing. For specific component behavior:
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        
        expect(props.onChange).toHaveBeenCalledWith(options[0], expect.objectContaining({ action: 'select-option' }));
    });
  });

  // --- 7. Edge Case Testing ---
  describe('Edge Cases', () => {
    it('should handle empty options array gracefully', () => {
      const noOptsMsg = "No options available";
      render(<Select {...getProps({ options: [], menuIsOpen: true, noOptionsMessage: () => noOptsMsg })} />);
      expect(screen.getByText(noOptsMsg)).toBeInTheDocument();
    });

    it('should display loadingMessage when isLoading is true', () => {
      const loadingMsg = "Loading items...";
      render(<Select {...getProps({ isLoading: true, menuIsOpen: true, loadingMessage: () => loadingMsg })} />);
      expect(screen.getByText(loadingMsg)).toBeInTheDocument();
      // Ensure no options are shown
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('should blur and call onMenuClose if disabled while focused', async () => {
        const props = getProps({ menuIsOpen: true });
        const { rerender } = render(<Select {...props} />);
        
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        expect(input).toHaveFocus();

        rerender(<Select {...props} isDisabled={true} />);
        
        await waitFor(() => {
            // JSDOM focus can be tricky, but the component should internally set isFocused to false
            expect(props.onMenuClose).toHaveBeenCalled();
        });
        expect(input).toBeDisabled(); // Check if it's actually disabled
    });
  });

  // --- 8. Performance Testing (Conceptual) ---
  // Direct performance tests are hard in JSDOM. We rely on efficient component design.
  // For large option sets, virtualization would be a key feature (not present here).
  // We can ensure that unnecessary re-renders are minimized by checking mock function calls.

  // --- 9. Test Coverage Requirements (Achieved through comprehensive tests) ---

  // --- 10. Test Documentation (Provided by test descriptions) ---

  // --- Additional tests for specific props ---
  describe('Specific Prop Behaviors', () => {
    it('autoFocus should focus the input on mount', () => {
      render(<Select {...getProps({ autoFocus: true })} />);
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('closeMenuOnSelect={false} should keep menu open after selection', async () => {
      const props = getProps({ menuIsOpen: true, closeMenuOnSelect: false });
      render(<Select {...props} />);
      await user.click(screen.getByText(options[0].label));
      expect(props.onChange).toHaveBeenCalled();
      expect(props.onMenuClose).not.toHaveBeenCalled();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('blurInputOnSelect={true} should blur input after selection', async () => {
        // blurInputOnSelect defaults to isTouchCapable(). Force true.
        mockIsTouchCapable.mockReturnValue(true); // Makes blurInputOnSelect default to true
        const props = getProps({ menuIsOpen: true }); // Relies on mocked default
        // OR explicitly: const props = getProps({ menuIsOpen: true, blurInputOnSelect: true });
        render(<Select {...props} />);
        const input = screen.getByRole('combobox');
        fireEvent.focus(input); // Ensure focused

        await user.click(screen.getByText(options[0].label));
        expect(props.onChange).toHaveBeenCalled();
        
        await waitFor(() => {
            expect(props.onBlur).toHaveBeenCalled();
        });
    });

    it('should call scrollIntoView when menu opens and an option is focused', async () => {
        mockScrollIntoView.mockClear();
        render(<Select {...getProps({ menuIsOpen: true, value: options[0] })} />); // options[0] will be focused
        // scrollIntoView is called in componentDidMount if menuIsOpen and focusedOption exists
        // and in componentDidUpdate if scrollToFocusedOptionOnUpdate is true
        expect(mockScrollIntoView).toHaveBeenCalled();
    });

    it('should render custom components passed via `components` prop', () => {
        const CustomControl = jest.fn((props) => <div data-testid="custom-control" {...props.innerProps}>{props.children}</div>);
        render(<Select {...getProps({ components: { Control: CustomControl } })} />);
        expect(CustomControl).toHaveBeenCalled();
        expect(screen.getByTestId('custom-control')).toBeInTheDocument();
    });

    it('should apply custom styles via `styles` prop', () => {
        const customStyles = {
            control: (base: any) => ({ ...base, backgroundColor: 'rgb(255, 0, 0)' }),
        };
        render(<Select {...getProps({ styles: customStyles })} />);
        const controlElement = screen.getByRole('combobox').closest('div[class*="control"]');
        expect(controlElement).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('should apply custom classNames via `classNames` prop', () => {
        const customClassNames = {
            control: () => 'my-custom-control-class',
        };
        render(<Select {...getProps({ classNames: customClassNames })} />);
        const controlElement = screen.getByRole('combobox').closest('div[class*="control"]');
        expect(controlElement).toHaveClass('my-custom-control-class');
    });

    it('closeMenuOnScroll (boolean true) should close menu on document scroll', () => {
        const props = getProps({ menuIsOpen: true, closeMenuOnScroll: true });
        render(<Select {...props} />);
        
        // Find the scroll listener attached by the component
        const scrollListenerCall = (document.addEventListener as jest.Mock).mock.calls.find(
            call => call[0] === 'scroll' && typeof call[1] === 'function'
        );
        expect(scrollListenerCall).toBeDefined();
        const scrollListener = scrollListenerCall[1];

        // Simulate a scroll event on the documentElement
        act(() => {
            scrollListener({ target: document.documentElement });
        });
        
        expect(props.onMenuClose).toHaveBeenCalled();
    });
  });
});
```

**Explanation and Key Points:**

1.  **Mocking:**
    *   External utility functions (`isTouchCapable`, `isMobileDevice`, `scrollIntoView`, `isAppleDevice`, `isDocumentElement`) are mocked to control their behavior during tests and prevent side effects.
    *   Internal complex components like `MenuPlacer` and `ScrollManager` are mocked to simplify tests and focus on the `Select` component's logic. The mock for `MenuPlacer` ensures it calls its `children` prop with the expected structure.
    *   `document.addEventListener` can be spied upon if you need to verify that listeners are added/removed correctly, or to manually trigger them as shown in the `closeMenuOnScroll` test.

2.  **`getProps` Helper:** This utility function is crucial for reducing boilerplate. It provides default props (including mocked handlers like `onChange`) and allows overriding specific props for each test case. `instanceId` is set by default for deterministic element IDs.

3.  **`userEvent` vs. `fireEvent`:**
    *   `userEvent` is used for more realistic user interactions like typing and clicking, as it dispatches multiple events (e.g., `mousedown`, `mouseup`, `click`).
    *   `fireEvent` is used for specific, lower-level event dispatches, like focusing, blurring, or specific keydown events where `userEvent` might be too high-level or its behavior isn't precisely what's needed for a unit test.

4.  **Testing Structure:** Tests are grouped by functionality (Rendering, User Interactions, State, Menu, Accessibility, etc.) using `describe` blocks.

5.  **ARIA Attributes:** Accessibility is a key part. Tests verify `aria-*` attributes change correctly based on the component's state (e.g., `aria-expanded`, `aria-activedescendant`, `aria-selected`).

6.  **Asynchronous Operations:** `waitFor` is used when an interaction causes an asynchronous state update that leads to a DOM change (e.g., menu closing).

7.  **Controlled vs. Uncontrolled:** The tests cover how the component reacts to controlled props (`value`, `inputValue`) and also how it manages its internal state for uncontrolled behaviors.

8.  **Edge Cases:** Tests for empty options, loading states, and disabling the component while focused are included.

9.  **Customization Props:** `components`, `styles`, `classNames`, `formatOptionLabel` are tested to ensure they allow proper customization.

10. **`act()`:** While `userEvent` often wraps its operations in `act`, sometimes explicit `act` wrapping is needed if you're manually triggering state updates outside of `userEvent` or `fireEvent` that lead to React updates (e.g., manually calling a mocked event handler that sets state).

**To Run Tests and Get Coverage:**

```bash
npm test
npm test -- --coverage
# or
yarn test
yarn test --coverage
```

This test suite provides a strong foundation. You might discover more specific scenarios or intricate interactions as you work with the component, which can then be added as new test cases. Remember that testing the *integration* of `MenuPlacer` or `ScrollManager` would be a separate concern, possibly in integration tests or by testing those components individually if they are complex enough.

### Tokens: {'input_tokens': 18518, 'output_tokens': 9171}
### Execution time: 266.0087561607361
