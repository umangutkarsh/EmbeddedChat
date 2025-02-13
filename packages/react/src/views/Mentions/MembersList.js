import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import styles from './MembersList.styles';

function MembersList({ mentionIndex, filteredMembers = [], onMemberClick }) {
  const handleMemberClick = useCallback(
    (selectedItem) => {
      onMemberClick(selectedItem);
    },
    [onMemberClick]
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        const selectedItem =
          mentionIndex < filteredMembers.length
            ? filteredMembers[mentionIndex]
            : mentionIndex === filteredMembers.length
            ? 'all'
            : 'here';
        handleMemberClick(selectedItem);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mentionIndex, filteredMembers, handleMemberClick]);

  return (
    <Box css={styles.list}>
      <ul style={{ listStyle: 'none' }}>
        {filteredMembers.map((member, index) => (
          <li
            key={member._id}
            role="presentation"
            css={styles.listItem}
            onClick={() => handleMemberClick(member)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMemberClick(member);
              }
            }}
            style={{
              backgroundColor: index === mentionIndex && '#dddddd',
            }}
          >
            <Box is="span" style={{ justifyContent: 'space-evenly' }}>
              <Box is="span" css={styles.listText}>
                {member.name}
              </Box>
              &nbsp;&nbsp;&nbsp;
              <Box is="span">@{member.username}</Box>
            </Box>
          </li>
        ))}
        <li
          key="all"
          role="presentation"
          css={styles.listItem}
          onClick={() => handleMemberClick('all')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('all');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length && '#dddddd',
          }}
        >
          <Box is="span" css={styles.listText}>
            all
          </Box>
        </li>
        <li
          key="here"
          role="presentation"
          css={styles.listItem}
          onClick={() => handleMemberClick('here')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('here');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length + 1 && '#dddddd',
          }}
        >
          <Box is="span" css={styles.listText}>
            here
          </Box>
        </li>
      </ul>
    </Box>
  );
}

MembersList.propTypes = {
  mentionIndex: PropTypes.any,
  filteredMembers: PropTypes.array,
  onMemberClick: PropTypes.func.isRequired,
};

export default MembersList;
