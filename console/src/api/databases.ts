import { faasbaseApi } from ".";

export const getDatabases = async ({ queryKey }: any) => {
    const [_key, { getAccessTokenSilently, currentWorkspace }] = queryKey
    if (!currentWorkspace?.id) {
        return
    }
    return faasbaseApi(await getAccessTokenSilently()).get("databases?workspace_id=" + currentWorkspace?.id);
}
export const getDatabase = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId }] = queryKey
  return faasbaseApi(await getAccessTokenSilently()).get("databases/"+databaseId);
}

export const getTables = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId }] = queryKey
  return faasbaseApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables");
}

export const getFields = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId, tableId }] = queryKey
  return faasbaseApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables/"+tableId+"/fields");
}
export const getTable = async ({ queryKey }: any) => {
  const [_key, { getAccessTokenSilently, databaseId, tableId }] = queryKey
  return faasbaseApi(await getAccessTokenSilently()).get("databases/"+databaseId+"/tables/"+tableId);
}
export const createTable = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).post("databases/"+data?.database_id+"/tables", {
      ...data,
  });
}
export const createDatabase = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).post("databases", {
      ...data,
  });
}

export const createField = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).post("databases/"+data?.database_id+"/tables/"+data?.table_id+"/fields", {
      ...data,
  });
}

export const deleteTable = async (databaseId: string, tableId: string, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).delete(`/databases/${databaseId}/tables/${tableId}`);
}
export const deleteField = async (fieldId: string, databaseId: string, tableId: string, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).delete(`/databases/${databaseId}/tables/${tableId}/fields/${fieldId}`);
}
export const deleteDatabase = async ( databaseId: string, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).delete(`/databases/${databaseId}`);
}

export const updateField = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).patch("databases/"+data?.database_id+"/tables/"+data?.table_id+"/fields/"+data?.id, {
      ...data,
  });
}

export const updateTable = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).patch("databases/"+data?.database_id+"/tables/"+data?.table_id, {
      ...data,
  });
}

export const updateDatabase = async (data: any, getAccessTokenSilently: any) => {
  return faasbaseApi(await getAccessTokenSilently()).patch("databases/"+data?.database_id, {
      ...data,
  });
}