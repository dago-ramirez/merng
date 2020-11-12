import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth.js';
import PostCard from '../components/PostCard.js';
import PostForm from '../components/PostForm.js';
import { FETCH_POSTS_QUERY } from '../util/graphql.js';

export default function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    // const posts = data.getPosts;
    return (
        <Grid columns={3} >
            <Grid.Row className="page-title" >
                <h1>Recent Post</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading posts...</h1>
                ) : (
                    data.getPosts && data.getPosts.map(post => (
                        <Grid.Column key={post.id} style={{marginBottom: 20 }} >
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    )
}