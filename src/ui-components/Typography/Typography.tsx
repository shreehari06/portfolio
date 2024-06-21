import React, { ReactNode } from 'react'
import { Body, BodyMedium, BodySmall, Heading, SubHeading } from './styles'

export interface TypographyProps {
    type: 'heading' | 'body' | 'subheading' | 'bodyMedium' | 'bodySmall'
    children: ReactNode
    id?: string
}

const componentMap: {
    [K in TypographyProps['type']]?: React.ComponentType<{
        children?: React.ReactNode
        id?: string
    }>
} = {
    heading: Heading,
    body: Body,
    subheading: SubHeading,
    bodyMedium: BodyMedium,
    bodySmall: BodySmall,
}

const Typography = ({ type, children, id }: TypographyProps) => {
    const Component = componentMap[type]

    if (!Component) {
        return <>{children}</>
    }

    return <Component id={id}>{children}</Component>
}

export default Typography
