import React from 'react';

import { SearchResultsPage } from '../../components/pages/SearchResultsPage';

type Params = Promise<{ q?: string }>;

export default async function SearchPage(props: { searchParams: Params }) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || '';

    return <SearchResultsPage query={query} />;
}
