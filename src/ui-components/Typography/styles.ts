import styled from 'styled-components'

export const Heading = styled.h1`
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 700;
    font-size: ${64 / 16}rem; // 4rem
    line-height: 125%;
    color: #000000;
`

export const Body = styled.div`
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 300;
    font-size: ${20 / 16}rem; // 1.25rem
    line-height: 140%;
    color: #000000;
`

export const BodyMedium = styled(Body)`
    font-size: ${14 / 16}rem; // 0.875rem
`

export const BodySmall = styled(Body)`
    font-size: ${12 / 16}rem; // 0.75rem
`

export const SubHeading = styled.h2`
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 400;
    font-size: ${36 / 16}rem; // 2.25rem
    line-height: 125%;
    color: #000000;
`
export const BoldText = styled.span`
    font-weight: bold;
`
