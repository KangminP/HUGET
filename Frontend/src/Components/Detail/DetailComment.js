import React, { Component } from 'react';

// css
import './DetailComment.css';

// axios
import Axios from 'axios';

class DetailComment extends Component {
  constructor() {
    super();
    this.state = {
      commentList: [],
      commentInput: '',
      deleteId: '',
      editId: '',
      commentStatus: 'read', // read: 기본값, edit: 수정
      commentEditInput: '',
      editCommentId: null,
    };

    this.getCommentList = this.getCommentList.bind(this);
  }

  componentDidMount() {
    this.getCommentList();
  }

  // 댓글 리스트 불러오기
  async getCommentList() {
    const restName = this.props.name;
    try {
      const response = await Axios.get(
        `https://k3d202.p.ssafy.io/api/auth/rest/${restName}/comment/`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      // console.log(response.data)
      this.setState({
        commentList: response.data,
      });
    } catch (err) {
      console.log(err.response);
    }
  }

  // 댓글 제출
  onCommentSubmit = () => {
    const commentContent = this.state.commentInput;
    const restName = this.props.name;
    const userId = JSON.parse(sessionStorage.getItem('userData')).id;
    const token = JSON.parse(sessionStorage.getItem('userToken'));
    let commentForm = new FormData();
    commentForm.append('rest_name', restName);
    commentForm.append('user', userId);
    commentForm.append('comment_content', commentContent);

    Axios.post(`https://k3d202.p.ssafy.io/api/comment/`, commentForm, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data; boundary=---ssafy',
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          commentInput: '',
        });
        this.getCommentList();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // 댓글 수정 버튼 클릭
  onCommentEdit = (comment) => {
    this.setState({
      commentStatus: 'edit',
      editCommentId: comment.id,
      commentEditInput: comment.comment_content,
    });
  };

  // 댓글 수정 완료
  onCommentEditSubmit = (id) => {
    const commentEditContent = this.state.commentEditInput;
    const restName = this.props.name;
    const commentId = id;
    const userId = JSON.parse(sessionStorage.getItem('userData')).id;
    const token = JSON.parse(sessionStorage.getItem('userToken'));
    let commentEditForm = new FormData();
    commentEditForm.append('id', commentId);
    commentEditForm.append('rest_name', restName);
    commentEditForm.append('user', userId);
    commentEditForm.append('comment_content', commentEditContent);

    Axios.put(`https://k3d202.p.ssafy.io/api/comment/`, commentEditForm, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data; boundary=---ssafy',
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        alert('댓글이 수정되었습니다.');
        this.getCommentList();
        this.setState({
          editCommentId: null,
          commentEditInput: '',
          commentStatus: 'read',
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      commentStatus: 'read',
    });
  };

  // 댓글 삭제 버튼 클릭
  onCommentDelete = (id) => {
    const token = JSON.parse(sessionStorage.getItem('userToken'));
    const restName = this.props.name;
    const commentId = id;
    Axios.delete(
      `https://k3d202.p.ssafy.io/api/auth/rest/${restName}/comment/${commentId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )
      .then((res) => {
        this.getCommentList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    // 댓글 목록 mapping
    const comments = this.state.commentList.map((comment, index) => (
      <div
        key={index}
        className="w-100 h-100 box effect d-flex align-items-center comment-card"
      >
        <div className="container h-100">
          <div className="row h-100">
            {sessionStorage.getItem('userData') &&
            JSON.parse(sessionStorage.getItem('userData')).username ===
              comment.user ? (
              <>
                {/* 댓글 수정? */}
                {this.state.commentStatus === 'read' ? (
                  <>
                    <div className="col-12 col-sm-8 col-md-6 my-2">
                      <p className="h-100 mb-0 text-break d-flex align-items-center">
                        {comment.comment_content}
                      </p>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3 my-2 d-flex flex-row-reverse">
                      <p className="h-100 mb-0 text-break d-flex align-items-center">
                        {comment.nickname}
                      </p>
                    </div>
                    <div className="col-12 col-md-3 d-flex justify-content-around">
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          this.onCommentEdit(comment);
                        }}
                      >
                        <i className="far fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          if (window.confirm('정말로 삭제하시겠습니까?')) {
                            this.onCommentDelete(comment.id);
                          }
                        }}
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                  </>
                ) : this.state.editCommentId === comment.id ? (
                  <>
                    <div className="col-12 col-md-9 my-2 d-flex align-items-center">
                      {/* <p>{comment.comment_content}</p> */}
                      {/* 수정 인풋창 */}
                      <input
                        type="text"
                        className="w-100 form-control"
                        value={this.state.commentEditInput}
                        onChange={(e) => {
                          this.setState({
                            commentEditInput: e.target.value,
                          });
                        }}
                      ></input>
                    </div>
                    <div className="col-12 col-md-3 d-flex justify-content-around">
                      {/* 수정 완료 버튼 */}
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          e.preventDefault();
                          this.onCommentEditSubmit(comment.id);
                        }}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      {/* 수정 취소 버튼 */}
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({
                            commentStatus: 'read',
                          });
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 댓글 내용 */}
                    <div className="col-12 col-sm-8 col-md-6 my-2">
                      <p className="h-100 mb-0 text-break d-flex align-items-center">
                        {comment.comment_content}
                      </p>
                    </div>
                    {/* 댓글 작성자 */}
                    <div className="col-12 col-sm-4 col-md-3 my-2 d-flex flex-row-reverse">
                      <p className="h-100 mb-0 text-break d-flex align-items-center">
                        {comment.nickname}
                      </p>
                    </div>
                    {/* 버튼 모음 */}
                    <div className="col-12 col-md-3 d-flex justify-content-around">
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          e.preventDefault();
                          this.onCommentEdit(comment);
                        }}
                      >
                        <i className="far fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={(e) => {
                          e.preventDefault();
                          this.onCommentDelete(comment.id);
                        }}
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="col-12 col-sm-8 col-md-6 my-2">
                  <p className="h-100 mb-0 text-break d-flex align-items-center">
                    {comment.comment_content}
                  </p>
                </div>
                <div className="col-12 col-sm-4 col-md-3 my-2 d-flex flex-row-reverse">
                  <p className="h-100 mb-0 text-break d-flex align-items-center">
                    {comment.nickname}
                  </p>
                </div>
                <div className="col-md-3 d-flex justify-content-around"></div>
              </>
            )}
          </div>
        </div>
      </div>
    ));

    return (
      <>
        <div className="box effect">
          <div className="ml-1 mb-3 detail-box-title">댓글</div>
          {/* 댓글창 */}
          <div className="form-group">
            <div className="row">
              <div className="col-10">
                {sessionStorage.getItem('userToken') ? (
                  <>
                    <input
                      type="text"
                      className="form-control"
                      id="CommentForm"
                      placeholder="한줄평을 남겨주세요."
                      value={this.state.commentInput}
                      onChange={(e) => {
                        this.setState({
                          commentInput: e.target.value,
                        });
                      }}
                    ></input>
                  </>
                ) : (
                  <>
                    <input
                      disabled
                      className="form-control"
                      id="CommentForm"
                      placeholder="댓글을 쓰려면 로그인하세요."
                    ></input>
                  </>
                )}
              </div>
              <div className="col-2 pl-0 d-flex justify-content-end align-items-center">
                {sessionStorage.getItem('userToken') ? (
                  <>
                    <button
                      type="submit"
                      className="h-100 w-100 btn btn-outline-dark d-flex justify-content-center align-items-center"
                      onClick={(e) => {
                        this.onCommentSubmit();
                      }}
                    >
                      <i className="far fa-comment-dots"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled
                      className="h-100 w-100 btn btn-outline-dark d-flex justify-content-center align-items-center"
                    >
                      <i className="far fa-comment-dots"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 댓글 목록 */}
        {comments}
      </>
    );
  }
}

export default DetailComment;
