import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const LinkStyled = styled(Link)`
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primaryText};

    p {
        font-weight: bold;
        margin-bottom: 0px;
    }
    &:hover {
        color: ${({ theme }) => theme.colors.lightGrayText};
    }
`;
