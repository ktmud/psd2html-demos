<?php
// $Id: comment.tpl.php,v 1.10 2008/01/04 19:24:24 goba Exp $
?>
<div class="comment<?php print ($comment->new) ? ' comment-new' : ''; print ' '. $status; print ' '. $zebra; ?>">

  <div class="clear-block">
  <?php if ($submitted): ?>
    <cite class="submit-info"><?php print $submitted; ?>
    </cite>
  <?php endif; ?>
  
  <?php if ($picture) : ?>
     <?php print $picture ?>
  <?php endif; ?>
  
   <h3><?php print $title ?>
    <?php if ($comment->new) : ?>
    <em class="new"><?php print drupal_ucfirst($new) ?></em>
  <?php endif; ?></h3>

    <div class="content">
      <?php print $content ?>
      <?php if ($signature): ?>
      <div class="clear-block signature">
        <hr />
        <?php print $signature ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
  <?php if ($links): ?>
    <div class="tool-links"><?php print $links ?></div>
  <?php endif; ?>
</div>
<hr />
