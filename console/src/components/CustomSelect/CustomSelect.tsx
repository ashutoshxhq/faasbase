import {
    chakra,
    FormControlOptions,
    forwardRef,
    HTMLChakraProps,
    omitThemingProps,
    ThemingProps,
    useFormControl,
    useMergeRefs,
    useMultiStyleConfig,
    usePopper,
} from '@chakra-ui/react'
import { mergeWith } from '@chakra-ui/utils'
import { useSelect } from 'downshift'
import * as React from 'react'

export interface SelectProps
    extends FormControlOptions,
    ThemingProps<'Select'>,
    Omit<
        HTMLChakraProps<'button'>,
        'disabled' | 'required' | 'readOnly' | 'size' | 'value' | 'onChange'
    > {
    placeholder?: string
    value?: string | null | undefined
    onChange?: (item: string) => void
}

export const CustomSelect = React.forwardRef<HTMLButtonElement, SelectProps>((props, ownRef) => {
    const { id, value, children, placeholder, onChange, ...rest } = omitThemingProps(props)
    const ownButtonProps = useFormControl<HTMLButtonElement>(rest)
    const styles = useMultiStyleConfig('CustomSelect', props)

    const validChildren = React.useMemo(
        () =>
            React.Children.toArray(children)
                .filter<React.ReactElement<{ value: string; children?: React.ReactElement }>>(
                    React.isValidElement,
                )
                .filter((child) => 'value' in child.props),
        [children],
    )

    const items = validChildren.map((child) => child.props.value)

    const { isOpen, selectedItem, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
        id,
        items,
        selectedItem: value,
        onSelectedItemChange: (val: any) => (val.selectedItem ? onChange?.(val.selectedItem) : undefined),
    })

    const { referenceRef: popperRef, getPopperProps } = usePopper({
        enabled: isOpen,
        gutter: 2,
    })
    const { ref: useSelectToggleButtonRef, ...useSelectToggleButtonProps } = getToggleButtonProps()

    const toggleButtonRef = useMergeRefs(ownRef, useSelectToggleButtonRef, popperRef)
    const toggleButtonProps = mergeWith(ownButtonProps, useSelectToggleButtonProps)

    return (
        <chakra.div position="relative" bg={"#1e1e1e"}>
            <chakra.button bg={"#1e1e1e"} ref={toggleButtonRef} __css={styles.field} border={"solid 1.5px"} {...toggleButtonProps}>
                {validChildren.find((child) => child.props.value === selectedItem)?.props.children ||
                    selectedItem || <chakra.span>{placeholder}</chakra.span>}
                <SelectIcon />
            </chakra.button>
            <chakra.div
                zIndex="1"
                bg={"#1e1e1e"}
                width="100%"
                {...mergeWith(getPopperProps(), {
                    style: { visibility: isOpen ? 'visible' : 'hidden' },
                })}
            >
                <chakra.ul bg={"#1e1e1e"} __css={styles.menu} {...getMenuProps()}>
                    {isOpen &&
                        validChildren.map((item, index) =>
                            React.cloneElement(item, {
                                __css: styles.option,
                                ...getItemProps({ item: item.props.value, index }),
                            }),
                        )}
                </chakra.ul>
            </chakra.div>
        </chakra.div>
    )
})

CustomSelect.displayName = 'CustomSelect'

export interface OptionProps extends HTMLChakraProps<'li'>, ThemingProps {
    value: string
}

export const Option = forwardRef<OptionProps, 'li'>((props, ref) => {
    const { children, value, ...rest } = omitThemingProps(props)
    const { option } = useMultiStyleConfig('CustomSelect', props)
    return (
        <chakra.li _selected={{bg: "whiteAlpha.200"}} ref={ref} __css={option} {...rest}>
            {children || value}
        </chakra.li>
    )
})

const DefaultIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
)

const SelectIcon = (props: React.ComponentProps<'svg'>) => (
    <DefaultIcon
        style={{ width: '1em', height: '1em', color: 'currentColor' }}
        role="presentation"
        focusable={false}
        aria-hidden
        {...props}
    />
)