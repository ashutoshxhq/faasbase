import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import { getApplication } from '../../../../api/applications';
import ReactMarkdown from 'react-markdown'

function ApplicationsOverview() {

  const { applicationId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const query = useQuery([`applications-${applicationId}`, { getAccessTokenSilently, applicationId }], getApplication);
  return (
    <ReactMarkdown children={query?.data?.data?.data?.readme} />
  )
}

export default ApplicationsOverview