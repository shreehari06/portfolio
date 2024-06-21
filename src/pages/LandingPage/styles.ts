import styled from 'styled-components'

export const HeroContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100ch;
    margin-inline: auto;
    height: 100dvh;
    transform: translateY(-5%);

    & > h1[class^='Heading-'] {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
`
