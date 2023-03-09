import React, { useState } from "react";
import { joinClasses } from "../../utils/cssUtils";
import styles from "./TreeView.module.css";

type TreeViewProps = {
  children?: React.ReactNode;
};

export const TreeView: React.FC<TreeViewProps> = ({ children }) => {
  return <>{children}</>;
};

//-------------------------------------------------------
type TreeHeaderProps = {
  children?: React.ReactNode;
};

export const TreeHeader: React.FC<TreeHeaderProps> = ({ children }) => {
  return <>{children}</>;
};

//-------------------------------------------------------
type TreeItemProps = {
  children?: React.ReactNode;
};

export const TreeItem: React.FC<TreeItemProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  let header: React.ReactElement | undefined = undefined;
  let content: React.ReactElement[] = [];

  //find header and content
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === TreeHeader) {
      header = child;
    } else {
      content.push(child);
    }
  });

  if (!header) {
    const [first, ...rest] = content;
    header = first;
    content = rest;
  }

  const hasContent = content.length > 0;

  function toggle() {
    setIsOpen((s) => !s);
  }

  return (
    <div>
      <div className={styles.header}>
        <div
          className={joinClasses({
            [styles.caret]: true,
            [styles.caretDown]: isOpen,
          })}
          onClick={toggle}
        >
          {hasContent && isOpen && <span>&#9660;</span>}
          {hasContent && !isOpen && <span>&#9654;</span>}
        </div>
        <div className={styles.headerContent}>{!!header && header}</div>
      </div>

      <div
        className={joinClasses({
          [styles.children]: true,
          [styles.childrenHidden]: !isOpen,
        })}
      >
        {content}
      </div>
    </div>
  );
};
