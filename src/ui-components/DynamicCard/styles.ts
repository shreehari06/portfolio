import styled from 'styled-components'

export const Container = styled.div`
    display: inline-flex;
    flex-direction: column;
    width: 20rem;
    height: 20rem;

    background: #d9d9d9;

    border-radius: 20px;
    transition: width 0.2s, height 0.2s;

    flex-shrink: 0;

    &:hover,
    &:focus {
        width: 30rem;
    }
`

export const CardsContainer = styled.div`
    width: 100%;
    height: 20rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    overflow: auto;
    display: flex;
    gap: 1rem;
    position: relative;
`
