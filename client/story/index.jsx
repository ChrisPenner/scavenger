import React from 'react';
class Story extends React.Component {
    componentWillMount() {
        fetch(`/story/`)
    }

    render() {
        return (
            <div> My Stories: </div>
        )
    }
}

export default Story
