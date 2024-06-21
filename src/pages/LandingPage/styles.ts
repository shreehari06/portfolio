import styled from 'styled-components'

const BaseContainer = styled.div`
    width: 60vw;
    height: 100dvh;
    margin-inline: auto;
`

export const HeroContainer = styled(BaseContainer)`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    transform: translateY(-5%);

    & > h1[class^='Heading-'] {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
`
export const SectionContainer = styled(BaseContainer)`
    & > h1[class^='Heading-'] {
        padding-top: 6rem;
        padding-bottom: 2.25rem;
    }
`
export const ProjectsContainer = styled(SectionContainer)``
