
<header>
    <h1 class="text-center">Send Your <mark>Wishes</mark></h1>
</header>
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <article class="call-for-wishes text-center">
                {{#callForWishes}}
                <p>{{{.}}}</p>
                {{/callForWishes}}
            </article>
            <article class="remerciement text-center">
                {{#remerciement}}
                <p>{{{.}}}</p>
                {{/remerciement}}
            </article>
        </div>
        <div class="col-sm-6">
            <div class="wish-form">
                <form>
                    <div class="form-group">
                        <textarea class="form-control" rows="3" placeholder="在这里留下你的祝福，记得留下名字哦"></textarea>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-lg btn-block" type="submit">
                            <i class="fa fa-envelope fa-lg"></i>
                            <small>发送祝福</small>
                        </button>
                    </div>
                </form>
                <article class="messages"></article>
            </div>
        </div>
    </div>
</div>
