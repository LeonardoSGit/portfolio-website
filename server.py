from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import os

app = Flask(__name__)

# SQLite database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

# Create a database connection
def get_db():
    conn = sqlite3.connect(DB_PATH)
    return conn

# Initialize the database table
def init_db():
    conn = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        conn.cursor().executescript(f.read())
    conn.commit()

# Route to display and add photos
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        title = request.form['title']
        before = request.files['before']
        after = request.files['after']

        if title and before and after:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO photos (title, before_path, after_path) VALUES (?, ?, ?)",
                        (title, 'static/images/before/' + before.filename, 'static/images/after/' + after.filename))
            conn.commit()

            before.save('static/images/before/' + before.filename)
            after.save('static/images/after/' + after.filename)

            return redirect(url_for('index'))

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM photos")
    photos = cur.fetchall()

    return render_template('index.html', photos=photos)

# Route for admin screen
@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        title = request.form['title']
        before = request.files['before']
        before_method = request.form['beforeMethod']
        before_description = request.form['beforeDescription']
        after = request.files['after']
        after_method = request.form['afterMethod']
        after_description = request.form['afterDescription']

        if title and before and after:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO photos (title, before_path, before_method, before_description, after_path, after_method, after_description) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (title, 'static/images/before/' + before.filename, before_method, before_description, 'static/images/after/' + after.filename, after_method, after_description))
            conn.commit()

            before.save('static/images/before/' + before.filename)
            after.save('static/images/after/' + after.filename)

            return redirect(url_for('admin'))

    return render_template('admin.html')

@app.route('/api/photos', methods=['GET'])
def get_photos():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT * FROM photos')
        rows = cur.fetchall()

        photos = []
        for row in rows:
            photo = {
                'id': row[0],
                'title': row[1],
                'before_path': row[2],
                'before_method': row[3],
                'before_description': row[4],
                'after_path': row[5],
                'after_method': row[6],
                'after_description': row[7]
            }
            photos.append(photo)    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

    return jsonify(photos)

if __name__ == '__main__':
    app.static_folder = 'static'
    app.run(debug=True)
