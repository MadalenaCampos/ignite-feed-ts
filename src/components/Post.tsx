import styles from "./Post.module.css";

import { Avatar } from "./Avatar";
import { Comment } from "./Comment";

import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";
// https://date-fns.org/v2.30.0/docs/format

interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}

interface Content {
  type: "paragraph" | "link";
  content: string;
}

export interface PostProps {
  id?: number;
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  // Aqui é usado uma biblioteca para formatar a data, porém pode-se usar apenas o Intl.DateTimeFormat
  const dateFormated = format(publishedAt, "dd 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  const [comments, setComments] = useState([] as Array<string>);
  const [newComment, setNewComment] = useState("");

  function handleCommentSubmit(event: FormEvent) {
    event.preventDefault();

    setComments([...comments, newComment]);
    setNewComment("");
  }

  function handleNewComment(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewComment(event.target.value);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("O comentário não pode ser vazio");
  }

  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeletedOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentInvalid = newComment.length === 0;

  return (
    <div>
      <div className={styles.post}>
        <div className={styles["post-header"]}>
          <div className={styles["post-header-usuario"]}>
            <Avatar src={author.avatarUrl} />

            <div className={styles["post-header-usuario-informacoes"]}>
              <h4>{author.name}</h4>
              <p>{author.role}</p>
            </div>
          </div>

          <div className={styles["post-header-data-de-publicacao"]}>
            <time title={dateFormated}>{publishedDateRelativeToNow}</time>
          </div>
        </div>

        <div className={styles["post-conteudo"]}>
          {content.map((line) => {
            if (line.type === "paragraph") {
              return <p key={line.content}>{line.content}</p>;
            } else if (line.type === "link") {
              return (
                <p key={line.content}>
                  <a href="">{line.content}</a>
                </p>
              );
            }
          })}
        </div>

        <form
          onSubmit={handleCommentSubmit}
          className={styles["post-feedback"]}
        >
          <strong>Deixe seu feedback</strong>

          <textarea
            name="comment"
            placeholder="Deixe seu feedback"
            onChange={handleNewComment}
            value={newComment}
            onInvalid={handleNewCommentInvalid}
            required
          />

          <footer className={styles["post-feedback-footer"]}>
            <button type="submit" disabled={isNewCommentInvalid}>
              Publicar
            </button>
          </footer>
        </form>

        <div className={styles["post-comentarios"]}>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment}
                content={comment}
                onDeleteComment={deleteComment}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
