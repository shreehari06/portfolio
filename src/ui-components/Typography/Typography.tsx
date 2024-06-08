import React, { ReactNode } from 'react'
import { Body, BodyMedium, BodySmall, Heading, SubHeading } from './styles'

export interface TypographyProps {
    type: 'heading' | 'body' | 'subheading' | 'bodyMedium' | 'bodySmall'
    children: ReactNode
}

const componentMap: {
    [K in TypographyProps['type']]?: React.ComponentType<{
        children?: React.ReactNode
    }>
} = {
    heading: Heading,
    body: Body,
    subheading: SubHeading,
    bodyMedium: BodyMedium,
    bodySmall: BodySmall,
}

const Typography = ({ type, children }: TypographyProps) => {
    const Component = componentMap[type]

    if (!Component) {
        return <>{children}</>
    }

    return <Component>{children}</Component>
}

export default Typography
