import React, { useContext, useEffect, useState } from 'react';
import { MessageType, TableItem } from 'src/config/types/types';
import useAsyncError from 'src/hooks/useAsyncError';
import { handleErros } from 'src/apis/siscopDB';
import { generateBody, handleEvents } from './MessageItemFunction';
import DataContext from 'src/data/DataContext';

function MessageItem({ element, setRefresh, path }: TableItem<MessageType>): JSX.Element {
    const { user, setUser } = useContext(DataContext);
    const listenerState = useState('');
    const throwError = useAsyncError();

    useEffect(() => {
        handleEvents(listenerState, setRefresh, element, user, path as string).catch((error) => handleErros(error as Error, setUser, throwError));
    }, [listenerState[0]]);

    return <>{generateBody(listenerState, element, path as string)}</>;
}

export default MessageItem;
