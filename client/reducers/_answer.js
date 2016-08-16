import * as at from 'action-types'
import reducer from './answer'
import { loadAnswers } from 'actions'
import { Answer } from 'resources'

describe('Answer Reducer', function() {
  const startAnswer = Answer.new({
      uid: 'STORY:CLUE:ANSWER',
      storyUid: 'STORY',
      clueUid: 'CLUE',
      pattern: 'my-pattern',
      nextClue: 'MY-NEXT-CLUE',
  })
  const answers = {
    [startAnswer.uid]: startAnswer,
  }
  it('should overwrite answers when loading', function() {
    const newAnswer = Answer.new({
      uid: 'STORY:NEWCLUE:NEWANSWER',
      storyUid: 'NEWSTORY',
      clueUid: 'NEWCLUE',
      pattern: 'new pattern',
      nextClue: 'STORY:NEW-NEXT-CLUE',
    })
    const action = {
      type: at.LOAD_ANSWERS,
      payload: newAnswer
    }
    const newState = reducer(answers, action)
    expect(newState).to.equal({
      [newAnswer.uid]: newAnswer,
    })
  });
});
