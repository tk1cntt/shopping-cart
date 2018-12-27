import $ from 'jquery';
import tmallshop from './tmall-shop';

class Tmall extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div
          className={
            this.props.settings.button
              ? `${this.classButtonDetail} visible`
              : `${this.classButtonDetail} hidden`
          }
          accessKey="s"
          onClick={() => {
            store.dispatch({ type: 'ADD-FROM-BUTTON', addFromButton: true });
            store.dispatch({ type: 'TOGGLE-COG', buttonCog: true });
          }}
        >
          <div className={this.classPopupDetail}>Saved</div>
          <div className="x-line" />
          <div className="y-line" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bookmark: state.bookmark,
  settings: state.settings,
  animation: state.animation,
  authentication: state.authentication
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tmall);
