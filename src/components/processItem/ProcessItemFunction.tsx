import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { siscopDelete, siscopShow } from 'src/apis/siscopDB';
import { Process, Section, User } from 'src/config/types/types';
import { Tr, Td } from '../Table';
import { LinkStyled } from '../LinkStyled';
import { Button } from '../Button';

async function validationEvents(path: string, processId: string, user: User<string, Section>): Promise<boolean> {
    let error = false;
    if (path === 'myProcess') {
        const process = (await siscopShow('processes', 0, { user: user._id, _id: processId })).data.response;
        if (!process) error = true;
    } else if (path === 'receivedProcess') {
        const process = (await siscopShow('processes', 0, { receiver: user._id, section: user.section._id, _id: processId })).data.response;
        if (!process) error = true;
    }

    return error;
}

function generateContent(element: Process, setListener: CallableFunction, path: string) {
    const href = setHref(path);
    return (
        <Tr>
            <Td $size={9}>
                <LinkStyled to={`${href}${element._id}`}>
                    <p>{element.title}</p>
                    <small>{element.date}</small>
                </LinkStyled>
            </Td>
            <Td $size={1}>
                <Link to={`${href}editar/${element._id}`}>
                    <Button $green key={2} value="editar">
                        Editar
                    </Button>
                </Link>
            </Td>
            <Td $size={1}>
                <Link to={`${href}anotar/${element._id}`}>
                    <Button $green key={3} value="anotação">
                        Anotação
                    </Button>
                </Link>
            </Td>
            <Td $size={1}>
                <Button $red key={4} value="deletar" onClick={() => setListener('delete')}>
                    Deletar
                </Button>
            </Td>
        </Tr>
    );
}

function generateDelete(element: Process, setListener: CallableFunction) {
    return (
        <Tr $delete>
            <Td $size={4}>
                <p>{`Tem certeza que deseja apagar o processo: "${element.title}"`}</p>
                <Button $green type="submit" value="deletar" onClick={() => setListener('deleteItem')}>
                    Ok
                </Button>
                <Button $red type="submit" value="cancel" onClick={() => setListener('')}>
                    Cancelar
                </Button>
            </Td>
        </Tr>
    );
}

function generateLoading() {
    return (
        <tr className="Table__tr--load">
            <td colSpan={4}>
                <div className="loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </td>
        </tr>
    );
}

export function setHref(path: string): string {
    if (path === 'myProcess') return `/meusProcessos/processo/`;
    else if (path === 'receivedProcess') return `/processosRecebidos/processo/`;
    else return '/null/';
}

export function generateBody(listenerState: [string, Dispatch<SetStateAction<string>>], element: Process | undefined, path: string) {
    const [listener, setListener] = listenerState;
    if (listener === 'delete' && element) return generateDelete(element, setListener);
    else if (listener == '' && !element) return '';
    else if (listener === '' && element) return generateContent(element, setListener, path);
    else return generateLoading();
}

export async function handleEvents(listenerState: [string, Dispatch<SetStateAction<string>>], element: Process, path: string, user: User<string, Section>, setRefresh: CallableFunction) {
    const [listener, setListener] = listenerState;

    if (listener === 'deleteItem') {
        try {
            await handleDeleteProcess(path, element._id, user);
            setListener('');
            setRefresh(true);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export async function handleDeleteProcess(path: string, processId: string, user: User<string, Section>) {
    if (!(await validationEvents(path, processId, user))) {
        await siscopDelete('processes', { _id: processId });
    }
}
